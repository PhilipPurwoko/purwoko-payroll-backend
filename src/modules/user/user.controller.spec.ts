import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 'admin-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should call create', () => {
    const dto: CreateUserDto = { email: 'a@b.com', password: '123' } as any;
    controller.create({ user: mockUser } as any, dto);
    expect(mockUserService.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', () => {
    controller.findOne('123');
    expect(mockUserService.findOne).toHaveBeenCalledWith('123');
  });

  it('should call update', () => {
    const dto: UpdateUserDto = { name: 'New' } as any;
    controller.update({ user: mockUser } as any, '123', dto);
    expect(mockUserService.update).toHaveBeenCalledWith('123', dto, mockUser);
  });

  it('should call remove', () => {
    controller.remove({ user: mockUser } as any, '123');
    expect(mockUserService.remove).toHaveBeenCalledWith('123', mockUser);
  });
});
