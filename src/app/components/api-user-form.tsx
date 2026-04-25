import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ApiUser, getApis, Api } from '../lib/storage';

interface ApiUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: Omit<ApiUser, 'id' | 'apiKey' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: ApiUser;
}

export function ApiUserForm({ open, onOpenChange, onSubmit, initialData }: ApiUserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]);
  const [apis, setApis] = useState<Api[]>([]);

  useEffect(() => {
    setApis(getApis());
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setStatus(initialData.status);
      setDescription(initialData.description || '');
      setSelectedApiIds(initialData.allowedApiIds);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setStatus('active');
    setDescription('');
    setSelectedApiIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      status,
      description,
      allowedApiIds: selectedApiIds,
    });
    resetForm();
    onOpenChange(false);
  };

  const toggleApiSelection = (apiId: string) => {
    setSelectedApiIds(prev =>
      prev.includes(apiId)
        ? prev.filter(id => id !== apiId)
        : [...prev, apiId]
    );
  };

  const selectAllApis = () => {
    setSelectedApiIds(apis.map(api => api.id));
  };

  const deselectAllApis = () => {
    setSelectedApiIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '编辑 API 用户' : '创建 API 用户'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">用户名称 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入用户名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱 *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select value={status} onValueChange={(value: 'active' | 'inactive') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">激活</SelectItem>
                <SelectItem value="inactive">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="用户说明（可选）"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>API 权限 ({selectedApiIds.length} / {apis.length})</Label>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllApis}
                >
                  全选
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllApis}
                >
                  清空
                </Button>
              </div>
            </div>

            {apis.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md text-center">
                暂无可用 API，请先创建 API
              </div>
            ) : (
              <div className="border rounded-md max-h-64 overflow-y-auto">
                <div className="divide-y">
                  {apis.map((api) => (
                    <div
                      key={api.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`api-${api.id}`}
                        checked={selectedApiIds.includes(api.id)}
                        onCheckedChange={() => toggleApiSelection(api.id)}
                      />
                      <label
                        htmlFor={`api-${api.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{api.name}</div>
                        <div className="text-sm text-gray-500">
                          {api.method} {api.path}
                        </div>
                      </label>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          api.method === 'GET'
                            ? 'bg-blue-100 text-blue-700'
                            : api.method === 'POST'
                            ? 'bg-green-100 text-green-700'
                            : api.method === 'PUT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {api.method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit">
              {initialData ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
