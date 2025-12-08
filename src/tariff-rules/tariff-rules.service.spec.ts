import { Test, TestingModule } from '@nestjs/testing';
import { TariffRulesService } from './tariff-rules.service';

describe('TariffRulesService', () => {
  let service: TariffRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TariffRulesService],
    }).compile();

    service = module.get<TariffRulesService>(TariffRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
