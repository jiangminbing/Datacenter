// 数据源类型定义
export interface DataSource {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'mongodb' | 'rest-api' | 'graphql';
  status: 'connected' | 'disconnected' | 'error';
  config: {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    url?: string;
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

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
