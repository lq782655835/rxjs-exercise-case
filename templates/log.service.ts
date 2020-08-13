import { TaskInstanceStatus } from '@/interfaces'
import { map } from 'rxjs/operators'
import { httpService } from './http.service'
import { loginService } from './login.service'

/**
 * 日志位置结构
 */
export interface LogPosition {
  /**
   * 偏移量
   */
  offset: number

  /**
   * 日志长度
   */
  length: number
}

/**
 * 日志服务
 */
export class LogService {
  /**
   * 打开任务日志弹窗
   * @param taskId 任务id
   * @param execId 执行id
   */
  openTaskLogWindow (taskId: string, execId: number) {
    const user = loginService.getUser()
    const logUrl = `/log/task${httpService.object2params({
      taskId,
      execId,
      clusterId: user.clusterId,
      product: user.product
    })}`

    window.open(logUrl, `_blank${Math.random()}`)
  }

  /**
   * 获取任务日志和运行状态
   * @param taskId 任务id
   * @param execId 执行id
   * @param clusterId 集群id
   * @param position 位置参数
   */
  fetchTaskLog (taskId: string, execId: string, clusterId: string, position: LogPosition) {
    return httpService
      .get<{
        status: TaskInstanceStatus
        data: string
      } & LogPosition>('/v1/task/instance/log', {
        taskId,
        execId,
        clusterId,
        ...position
      })
      .pipe(map(res => res.result))
  }
}

export const logService = new LogService()
