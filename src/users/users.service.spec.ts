import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUser = {
  id: 1,
  name: 'João da Silva',
  email: 'joao@exemplo.com',
};

describe('UsersService', () => {
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
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const result = await service.create(mockUser);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should return all users', async () => {
    mockUserRepository.find.mockResolvedValue([mockUser]);

    const result = await service.findAll();

    expect(result).toEqual([mockUser]);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findOne(1);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.update(1, mockUser);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, mockUser);
  });

  it('should remove a user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.remove(1);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
  });
});
