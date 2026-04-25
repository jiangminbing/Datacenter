// 数据源类型定义
export type DataSourceType =
  | 'mysql'
  | 'postgresql'
  | 'mongodb'
  | 'oracle'
  | 'sqlserver'
  | 'dm'          // 达梦数据库
  | 'doris'
  | 'clickhouse'
  | 'hive'
  | 'greenplum'
  | 'redis'
  | 'elasticsearch'
  | 'rest-api'
  | 'graphql';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: 'connected' | 'disconnected' | 'error';
  config: {
    host?: string;
    port?: number;
    database?: string;
    schema?: string;      // 用于 Oracle、PostgreSQL 等
    username?: string;
    password?: string;
    url?: string;
    serviceName?: string; // 用于 Oracle
    sid?: string;         // 用于 Oracle
  };
  createdAt: string;
  updatedAt: string;
}

// API 定义
export interface Api {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  dataSourceId: string;
  query: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// API 用户定义
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  allowedApiIds: string[]; // 允许调用的 API ID 列表
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// API 调用日志定义
export interface ApiCallLog {
  id: string;
  apiId: string;          // 调用的 API ID
  apiUserId: string;      // 调用的用户 ID
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;           // API 路径
  requestParams?: any;    // 请求参数（query params, body）
  requestHeaders?: Record<string, string>; // 请求头
  responseStatus: number; // 响应状态码
  responseData?: any;     // 响应数据
  responseTime: number;   // 响应时间（毫秒）
  ipAddress?: string;     // 请求 IP
  userAgent?: string;     // User Agent
  error?: string;         // 错误信息
  createdAt: string;      // 调用时间
}

// 获取所有数据源
export function getDataSources(): DataSource[] {
  const data = localStorage.getItem('dataSources');
  return data ? JSON.parse(data) : [];
}

// 保存数据源
export function saveDataSource(dataSource: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>): DataSource {
  const dataSources = getDataSources();
  const newDataSource: DataSource = {
    ...dataSource,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dataSources.push(newDataSource);
  localStorage.setItem('dataSources', JSON.stringify(dataSources));
  return newDataSource;
}

// 更新数据源
export function updateDataSource(id: string, updates: Partial<DataSource>): DataSource | null {
  const dataSources = getDataSources();
  const index = dataSources.findIndex(ds => ds.id === id);
  if (index === -1) return null;
  
  dataSources[index] = {
    ...dataSources[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('dataSources', JSON.stringify(dataSources));
  return dataSources[index];
}

// 删除数据源
export function deleteDataSource(id: string): boolean {
  const dataSources = getDataSources();
  const filtered = dataSources.filter(ds => ds.id !== id);
  if (filtered.length === dataSources.length) return false;
  localStorage.setItem('dataSources', JSON.stringify(filtered));
  return true;
}

// 获取所有 API
export function getApis(): Api[] {
  const data = localStorage.getItem('apis');
  return data ? JSON.parse(data) : [];
}

// 保存 API
export function saveApi(api: Omit<Api, 'id' | 'createdAt' | 'updatedAt'>): Api {
  const apis = getApis();
  const newApi: Api = {
    ...api,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  apis.push(newApi);
  localStorage.setItem('apis', JSON.stringify(apis));
  return newApi;
}

// 更新 API
export function updateApi(id: string, updates: Partial<Api>): Api | null {
  const apis = getApis();
  const index = apis.findIndex(api => api.id === id);
  if (index === -1) return null;
  
  apis[index] = {
    ...apis[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('apis', JSON.stringify(apis));
  return apis[index];
}

// 删除 API
export function deleteApi(id: string): boolean {
  const apis = getApis();
  const filtered = apis.filter(api => api.id !== id);
  if (filtered.length === apis.length) return false;
  localStorage.setItem('apis', JSON.stringify(filtered));
  return true;
}

// 获取所有 API 用户
export function getApiUsers(): ApiUser[] {
  const data = localStorage.getItem('apiUsers');
  return data ? JSON.parse(data) : [];
}

// 保存 API 用户
export function saveApiUser(user: Omit<ApiUser, 'id' | 'apiKey' | 'createdAt' | 'updatedAt'>): ApiUser {
  const users = getApiUsers();
  const newUser: ApiUser = {
    ...user,
    id: generateId(),
    apiKey: generateApiKey(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem('apiUsers', JSON.stringify(users));
  return newUser;
}

// 更新 API 用户
export function updateApiUser(id: string, updates: Partial<ApiUser>): ApiUser | null {
  const users = getApiUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('apiUsers', JSON.stringify(users));
  return users[index];
}

// 删除 API 用户
export function deleteApiUser(id: string): boolean {
  const users = getApiUsers();
  const filtered = users.filter(user => user.id !== id);
  if (filtered.length === users.length) return false;
  localStorage.setItem('apiUsers', JSON.stringify(filtered));
  return true;
}

// 重新生成 API Key
export function regenerateApiKey(userId: string): ApiUser | null {
  const users = getApiUsers();
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    apiKey: generateApiKey(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem('apiUsers', JSON.stringify(users));
  return users[index];
}

// 获取用户可访问的 API 列表
export function getUserApis(userId: string): Api[] {
  const user = getApiUsers().find(u => u.id === userId);
  if (!user) return [];

  const allApis = getApis();
  return allApis.filter(api => user.allowedApiIds.includes(api.id));
}

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 获取所有 API 调用日志
export function getApiCallLogs(): ApiCallLog[] {
  const data = localStorage.getItem('apiCallLogs');
  return data ? JSON.parse(data) : [];
}

// 保存 API 调用日志
export function saveApiCallLog(log: Omit<ApiCallLog, 'id' | 'createdAt'>): ApiCallLog {
  const logs = getApiCallLogs();
  const newLog: ApiCallLog = {
    ...log,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  logs.unshift(newLog); // 新日志放在最前面

  // 只保留最近 1000 条日志
  if (logs.length > 1000) {
    logs.splice(1000);
  }

  localStorage.setItem('apiCallLogs', JSON.stringify(logs));
  return newLog;
}

// 获取指定 API 的调用日志
export function getApiCallLogsByApiId(apiId: string): ApiCallLog[] {
  const logs = getApiCallLogs();
  return logs.filter(log => log.apiId === apiId);
}

// 获取指定用户的调用日志
export function getApiCallLogsByUserId(userId: string): ApiCallLog[] {
  const logs = getApiCallLogs();
  return logs.filter(log => log.apiUserId === userId);
}

// 获取 API 调用统计
export function getApiCallStats(apiId?: string, userId?: string) {
  const logs = getApiCallLogs();
  let filteredLogs = logs;

  if (apiId) {
    filteredLogs = filteredLogs.filter(log => log.apiId === apiId);
  }

  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.apiUserId === userId);
  }

  const totalCalls = filteredLogs.length;
  const successCalls = filteredLogs.filter(log => log.responseStatus >= 200 && log.responseStatus < 300).length;
  const errorCalls = filteredLogs.filter(log => log.responseStatus >= 400).length;
  const avgResponseTime = filteredLogs.length > 0
    ? filteredLogs.reduce((sum, log) => sum + log.responseTime, 0) / filteredLogs.length
    : 0;

  return {
    totalCalls,
    successCalls,
    errorCalls,
    avgResponseTime: Math.round(avgResponseTime),
    successRate: totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 0,
  };
}

// 清空调用日志
export function clearApiCallLogs(): boolean {
  localStorage.removeItem('apiCallLogs');
  return true;
}

// 生成模拟调用日志数据（用于演示）
export function generateMockApiCallLogs(count: number = 50): void {
  const apis = getApis();
  const users = getApiUsers();

  if (apis.length === 0 || users.length === 0) {
    return;
  }

  const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
  const statusCodes = [200, 200, 200, 201, 204, 400, 401, 403, 404, 500];
  const mockParams = [
    { id: 123, name: 'test' },
    { page: 1, limit: 10 },
    { search: 'keyword', filter: 'active' },
    {},
  ];
  const mockResponses = [
    { success: true, data: { id: 1, name: 'User 1' } },
    { success: true, data: [1, 2, 3, 4, 5] },
    { success: false, error: 'Not found' },
    { message: 'Created successfully' },
  ];

  const logs: ApiCallLog[] = [];

  for (let i = 0; i < count; i++) {
    const api = apis[Math.floor(Math.random() * apis.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const status = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const isSuccess = status >= 200 && status < 300;

    const log: ApiCallLog = {
      id: generateId(),
      apiId: api.id,
      apiUserId: user.id,
      method: methods[Math.floor(Math.random() * methods.length)],
      path: api.path,
      requestParams: mockParams[Math.floor(Math.random() * mockParams.length)],
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.apiKey}`,
        'User-Agent': 'Mozilla/5.0',
      },
      responseStatus: status,
      responseData: isSuccess ? mockResponses[Math.floor(Math.random() * mockResponses.length)] : null,
      responseTime: Math.floor(Math.random() * 1000) + 50,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      error: !isSuccess ? 'Request failed' : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    };

    logs.push(log);
  }

  // 按时间排序（最新的在前）
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  localStorage.setItem('apiCallLogs', JSON.stringify(logs));
}

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 生成 API Key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'ak_'; // API Key prefix
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
