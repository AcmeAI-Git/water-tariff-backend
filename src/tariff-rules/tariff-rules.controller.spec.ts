import { Test, TestingModule } from '@nestjs/testing';
import { TariffRulesController } from './tariff-rules.controller';

describe('TariffRulesController', () => {
  let controller: TariffRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffRulesController],
    }).compile();

    controller = module.get<TariffRulesController>(TariffRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
