/**
 * File Name    : community.service.ts
 * Description  : 커뮤니티 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 서비스 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 * 2024.09.10    김재영      Modified    댓글 관련 API 메서드 추가
 * 2024.09.10    김재영      Modified    TypeORM을 통한 데이터베이스 작업 처리 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능 추가 및 개선
 * 2024.09.12    김재영      Modified    게시글과 댓글의 대댓글 처리 로직 추가 및 리팩토링
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
 * 2024.09.18    김재영      Modified    예외 처리 개선
 * 2024.09.19    김재영      Modified    유저 권한 추가
 * 2024.09.23    김재영      Modified    로로 패턴으로 리팩토링
 */

import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityRepository } from './repositories/community.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { CreateCommunityDto } from '@_modules/community/dto/request/create-community.dto';
import { UpdateCommunityDto } from '@_modules/community/dto/request/update-community.dto';
import { PaginationQueryDto } from '@_modules/community/dto/request/pagination-query.dto';
import { CommunityResponseDto } from '@_modules/community/dto/response/community-response.dto';
import { Community } from '@_modules/community/entities/community.entity';
import { CommentRepository } from '@_modules/community/repositories/comment.repository';
import { UpdateCommentDto } from '@_modules/community/dto/request/update-comment.dto';
import { CreateCommentDto } from '@_modules/community/dto/request/create-comment.dto';
import { CommentResponseDto } from '@_modules/community/dto/response/comment-response.dto';
import { EntityManager } from 'typeorm';
import { Comment } from '@_modules/community/entities/comment.entity'; // Comment 엔티티 import

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityRepository)
    private readonly communityRepository: CommunityRepository,
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  private static readonly SERVER_ERROR_MSG = '서버 오류가 발생했습니다.';

  // 게시글 작성
  async createPost(createCommunityDto: CreateCommunityDto, userId: number): Promise<void> {
    await this.communityRepository.createPost({ ...createCommunityDto, userId });
  }

  // 게시글 수정
  async updatePost(postId: number, updateCommunityDto: UpdateCommunityDto, userId: number): Promise<void> {
    const post = await this.findPostById(postId);
    this.checkOwnership(userId, post.user.id);
    await this.communityRepository.updatePost(postId, updateCommunityDto);
  }

  // 게시글 삭제
  async deletePost(postId: number, userId: number): Promise<void> {
    const post = await this.findPostById(postId);
    this.checkOwnership(userId, post.user.id);
    await this.communityRepository.deletePost(postId);
  }

  // 게시글 전체 조회
  async findAll(paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityRepository.findAll(paginationQuery);
  }

  // 카테고리별 게시글 조회
  async findByCategory(category: string, paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityRepository.findByCategory(category, paginationQuery);
  }

  // 게시글 ID로 찾기
  public async findPostById(postId: number): Promise<Community> {
    const post = await this.communityRepository.findOne({ where: { postId } });
    if (!post) {
      throw new NotFoundException(`ID가 ${postId}인 게시글을 찾을 수 없습니다.`);
    }
    return post;
  }

  // 조회 수 증가
  async incrementViewCount(postId: number): Promise<void> {
    await this.communityRepository.increment({ postId }, 'viewCount', 1);
  }

  // 댓글 작성
  async createComment(postId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<void> {
    await this.commentRepository.createComment(postId, createCommentDto, userId, manager);
  }

  // 댓글 수정
  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<void> {
    const comment = await this.findCommentById(commentId);
    this.checkOwnership(userId, comment.user.id);
    await this.commentRepository.updateComment(commentId, updateCommentDto);
  }

  // 댓글 삭제
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.findCommentById(commentId);
    this.checkOwnership(userId, comment.user.id);
    await this.commentRepository.deleteComment(commentId);
  }

  // 대댓글 작성
  async createReply(commentId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<void> {
    await this.commentRepository.createReply(commentId, createCommentDto, userId, manager);
  }

  // 대댓글 수정
  async updateReply(replyId: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<void> {
    const reply = await this.findCommentById(replyId);
    this.checkOwnership(userId, reply.user.id);
    await this.commentRepository.updateReply(replyId, updateCommentDto);
  }

  // 대댓글 삭제
  async deleteReply(replyId: number, userId: number): Promise<void> {
    const reply = await this.findCommentById(replyId);
    this.checkOwnership(userId, reply.user.id);
    await this.commentRepository.deleteReply(replyId);
  }

  // 댓글 및 대댓글 조회 (페이징 지원)
  async getCommentsWithReplies(postId: number, paginationQuery: PaginationQueryDto): Promise<CommentResponseDto[]> {
    const { limit, offset } = paginationQuery;
    const comments = await this.commentRepository.findCommentsWithReplyCount(postId, limit, offset);

    return comments.map((comment) => new CommentResponseDto(comment));
  }

  // 댓글의 대댓글 조회 (페이징 지원)
  async getRepliesByCommentId(commentId: number, paginationQuery: PaginationQueryDto): Promise<CommentResponseDto[]> {
    const { limit, offset } = paginationQuery;
    const replies = await this.commentRepository.findRepliesByCommentId(commentId, limit, offset);

    return replies.map((reply) => new CommentResponseDto(reply));
  }

  // 댓글 ID로 찾기
  private async findCommentById(commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException(`ID가 ${commentId}인 댓글을 찾을 수 없습니다.`);
    }
    return comment;
  }

  // 소유권 확인
  private checkOwnership(userId: number, ownerId: number): void {
    if (userId !== ownerId) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }
  }
}