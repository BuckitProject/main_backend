import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from './dto/create-project.dto';

@Controller('/api/v1/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Create a new project
   * @param input
   */

  // todo: 쿼터 당 가격으로 총 쿼터 수 추가
  // todo: 타입 검증 추가
  @Post()
  async createProject(
    @Body() input: CreateProjectInput
  ): Promise<CreateProjectOutput> {
    return await this.projectService.createProject(input);
  }
}
