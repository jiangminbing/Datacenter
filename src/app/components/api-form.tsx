import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Api, saveApi, updateApi, getDataSources } from "../lib/storage";
import { toast } from "sonner";

interface ApiFormProps {
  api?: Api | null;
  onSuccess: () => void;
}

export function ApiForm({ api, onSuccess }: ApiFormProps) {
  const dataSources = getDataSources();
  const [formData, setFormData] = useState({
    name: api?.name || "",
    path: api?.path || "",
    method: api?.method || "GET",
    dataSourceId: api?.dataSourceId || "",
    query: api?.query || "",
    description: api?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.path || !formData.dataSourceId || !formData.query) {
      toast.error("请填写所有必填字段");
      return;
    }

    if (!formData.path.startsWith('/')) {
      toast.error("API 路径必须以 / 开头");
      return;
    }

    const payload = {
      name: formData.name,
      path: formData.path,
      method: formData.method as Api['method'],
      dataSourceId: formData.dataSourceId,
      query: formData.query,
      description: formData.description,
    };

    if (api?.id) {
      updateApi(api.id, payload);
      toast.success("API 已更新");
    } else {
      saveApi(payload);
      toast.success("API 已创建");
    }
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">API 名称 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例如: Get Users"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="method">HTTP 方法 *</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => setFormData({ ...formData, method: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="path">API 路径 *</Label>
          <Input
            id="path"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            placeholder="/users"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dataSource">数据源 *</Label>
        <Select
          value={formData.dataSourceId}
          onValueChange={(value) => setFormData({ ...formData, dataSourceId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择数据源" />
          </SelectTrigger>
          <SelectContent>
            {dataSources.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">暂无数据源</div>
            ) : (
              dataSources.map((ds) => (
                <SelectItem key={ds.id} value={ds.id}>
                  {ds.name} ({ds.type})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="query">SQL 查询 / API 配置 *</Label>
        <Textarea
          id="query"
          value={formData.query}
          onChange={(e) => setFormData({ ...formData, query: e.target.value })}
          placeholder="SELECT * FROM users WHERE id = :id"
          rows={6}
          className="font-mono text-sm"
          required
        />
        <p className="text-xs text-gray-500">
          使用 :paramName 定义路径参数，例如 :id
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="API 的描述信息..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {api ? "更新" : "创建"} API
        </Button>
      </div>
    </form>
  );
}
