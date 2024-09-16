/**
 * File Name    : expert.service.spec.ts
 * Description  : expert 서비스 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { ExpertService } from '@_modules/expert/expert.service';
import { Expert } from '@_modules/expert/entity/expert.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ExpertService', () => {
  let service: ExpertService;
  let expertRepository: Repository<Expert>;

  const mockExpertRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpertService,
        { provide: getRepositoryToken(Expert), useValue: mockExpertRepository },
      ],
    }).compile();

    service = module.get<ExpertService>(ExpertService);
    expertRepository = module.get<Repository<Expert>>(getRepositoryToken(Expert));
  });

  describe('getExperts', () => {
    it('should return a list of experts with total count', async () => {
      const expert = new Expert();
      const result = {
        data: [expert],
        totalCount: 1,
      };

      mockExpertRepository.find.mockResolvedValue([expert]);
      mockExpertRepository.count.mockResolvedValue(1);

      expect(await service.getExperts(1, 10)).toEqual(result);
      expect(expertRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getExpertById', () => {
    it('should return an expert by id', async () => {
      const expert = new Expert();
      mockExpertRepository.findOne.mockResolvedValue(expert);

      expect(await service.getExpertById(1)).toBe(expert);
      expect(expertRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});