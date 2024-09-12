/**
 * File Name    : simulation.controller.ts
 * Description  : ai simulation 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { Jwt } from '@_auth/guards/jwt';
import { AIChatHistoryDto } from '@_simulation/dto/ai-chat-history.dto';
import { AIChatResponseDto } from '@_simulation/dto/ai-chat-response.dto';
import { AskAIDto } from '@_simulation/dto/ask-ai.dto';
import { StartAIDto } from '@_simulation/dto/start-ai.dto';
import { SimulationService } from '@_simulation/simulation.service';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AIChatMessageDto } from './dto/ai-chat-message.dto';

@ApiTags('Simulation')
@Controller('simulation')
@UseGuards(Jwt)
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @ApiOperation({ summary: '유저의 채팅 세션 목록 조회' })
  @Get()
  async getUserHistory(@Req() req): Promise<AIChatHistoryDto> {
    const userId = req.user.id;
    const history = await this.simulationService.getUserSessions(userId);
    return { history };
  }

  @ApiOperation({ summary: '특정 채팅 세션의 대화 기록 조회' })
  @Get('/:sessionId')
  async getSessionHistory(@Param('sessionId') sessionId: number): Promise<AIChatMessageDto> {
    const messages = await this.simulationService.getSessionHistory(sessionId);
    return { messages };
  }

  @ApiOperation({ summary: '유저가 채팅방에 들어올 때, 이전 세션 이어받기 또는 새 세션 시작' })
  @Post('start-chat')
  async startChat(@Body() startAIDto: StartAIDto, @Req() req): Promise<{ sessionId: number }> {
    const userId = req.user.id;
    const session = await this.simulationService.handleSession(userId, startAIDto.startNewChat);
    return { sessionId: session.id };
  }

  @ApiOperation({ summary: '유저가 AI에게 질문을 던지면, AI 응답 생성 후 실시간 저장' })
  @Post('ask')
  async askAI(@Body() askAIDto: AskAIDto): Promise<AIChatResponseDto> {
    const aiResponse = await this.simulationService.getAIResponse(askAIDto.query);

    // 유저 질문과 AI 응답을 실시간으로 저장
    await this.simulationService.saveUserMessage(askAIDto.sessionId, askAIDto.query);
    await this.simulationService.saveAIMessage(askAIDto.sessionId, aiResponse.Answer);

    return {
      query: askAIDto.query,
      answer: aiResponse.Answer,
    };
  }
}
