import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DataSource, DataSourceType, saveDataSource, updateDataSource } from "../lib/storage";
import { toast } from "sonner";

// 数据源默认端口映射
const DEFAULT_PORTS: Record<string, number> = {
  mysql: 3306,
  postgresql: 5432,
  mongodb: 27017,
  oracle: 1521,
  sqlserver: 1433,
  dm: 5236,        // 达梦数据库
  doris: 9030,
  clickhouse: 9000,
  hive: 10000,
  greenplum: 5432,
  redis: 6379,
  elasticsearch: 9200,
};

interface DataSourceFormProps {
  dataSource?: DataSource | null;
  onSuccess: () => void;
}

export function DataSourceForm({ dataSource, onSuccess }: DataSourceFormProps) {
  const [formData, setFormData] = useState({
    name: dataSource?.name || "",
    type: dataSource?.type || "mysql",
    host: dataSource?.config.host || "",
    port: dataSource?.config.port?.toString() || "",
    database: dataSource?.config.database || "",
    schema: dataSource?.config.schema || "",
    username: dataSource?.config.username || "",
    password: dataSource?.config.password || "",
    url: dataSource?.config.url || "",
    serviceName: dataSource?.config.serviceName || "",
    sid: dataSource?.config.sid || "",
  });

  // 当数据源类型改变时，自动填充默认端口
  useEffect(() => {
    if (!formData.port && formData.type && DEFAULT_PORTS[formData.type]) {
      setFormData(prev => ({
        ...prev,
        port: DEFAULT_PORTS[formData.type].toString()
      }));
    }
  }, [formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("请输入数据源名称");
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type as DataSourceType,
      status: 'connected' as const,
      config: {
        ...(formData.host && { host: formData.host }),
        ...(formData.port && { port: parseInt(formData.port) }),
        ...(formData.database && { database: formData.database }),
        ...(formData.schema && { schema: formData.schema }),
        ...(formData.username && { username: formData.username }),
        ...(formData.password && { password: formData.password }),
        ...(formData.url && { url: formData.url }),
        ...(formData.serviceName && { serviceName: formData.serviceName }),
        ...(formData.sid && { sid: formData.sid }),
      },
    };

    if (dataSource?.id) {
      updateDataSource(dataSource.id, payload);
      toast.success("数据源已更新");
    } else {
      saveDataSource(payload);
      toast.success("数据源已创建");
    }
    
    onSuccess();
  };

  const isApiType = formData.type === 'rest-api' || formData.type === 'graphql';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">数据源名称 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例如: MySQL Production"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">数据源类型 *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
            <SelectItem value="oracle">Oracle</SelectItem>
            <SelectItem value="sqlserver">SQL Server</SelectItem>
            <SelectItem value="dm">达梦数据库 (DM)</SelectItem>
            <SelectItem value="doris">Apache Doris</SelectItem>
            <SelectItem value="clickhouse">ClickHouse</SelectItem>
            <SelectItem value="mongodb">MongoDB</SelectItem>
            <SelectItem value="redis">Redis</SelectItem>
            <SelectItem value="hive">Apache Hive</SelectItem>
            <SelectItem value="greenplum">Greenplum</SelectItem>
            <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
            <SelectItem value="rest-api">REST API</SelectItem>
            <SelectItem value="graphql">GraphQL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isApiType ? (
        <div className="space-y-2">
          <Label htmlFor="url">API URL *</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://api.example.com"
            type="url"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">主机地址</Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">端口</Label>
              <Input
                id="port"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                placeholder="3306"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">
              {formData.type === 'oracle' ? '数据库名称 / SID' : '数据库名称'}
            </Label>
            <Input
              id="database"
              value={formData.database}
              onChange={(e) => setFormData({ ...formData, database: e.target.value })}
              placeholder={
                formData.type === 'oracle' ? 'ORCL' :
                formData.type === 'mongodb' ? 'admin' :
                formData.type === 'redis' ? '0' :
                'my_database'
              }
            />
          </div>

          {/* Oracle 特殊字段 */}
          {formData.type === 'oracle' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name (可选)</Label>
                <Input
                  id="serviceName"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="orcl.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sid">SID (可选)</Label>
                <Input
                  id="sid"
                  value={formData.sid}
                  onChange={(e) => setFormData({ ...formData, sid: e.target.value })}
                  placeholder="ORCL"
                />
              </div>
            </div>
          )}

          {/* PostgreSQL、Greenplum、Oracle Schema */}
          {(formData.type === 'postgresql' || formData.type === 'greenplum' || formData.type === 'oracle') && (
            <div className="space-y-2">
              <Label htmlFor="schema">Schema (可选)</Label>
              <Input
                id="schema"
                value={formData.schema}
                onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                placeholder={formData.type === 'oracle' ? 'SYSTEM' : 'public'}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder={
                  formData.type === 'oracle' ? 'system' :
                  formData.type === 'sqlserver' ? 'sa' :
                  formData.type === 'dm' ? 'SYSDBA' :
                  'root'
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {dataSource ? "更新" : "创建"} 数据源
        </Button>
      </div>
    </form>
  );
}
