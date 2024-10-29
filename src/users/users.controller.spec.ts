import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUser = {
  id: 1,
  name: 'João da Silva',
  email: 'joao@exemplo.com',
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((user: Partial<User>) => user),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await controller.create(mockUser);
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should return all users', async () => {
    mockUserRepository.find.mockResolvedValue([mockUser]);
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const result = await controller.findOne('1'); // O ID é passado como string
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const result = await controller.update('1', mockUser); // O ID é passado como string
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, mockUser);
  });

  it('should remove a user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const result = await controller.remove('1'); // O ID é passado como string
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
  });
});
