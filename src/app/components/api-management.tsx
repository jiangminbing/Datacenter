import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Code, Copy, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ApiForm } from "./api-form";
import { getApis, deleteApi, Api, getApiUsers, ApiUser } from "../lib/storage";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";

export function ApiManagement() {
  const [apis, setApis] = useState<Api[]>([]);
  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<Api | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadApis = () => {
    setApis(getApis());
    setApiUsers(getApiUsers());
  };

  useEffect(() => {
    loadApis();
  }, []);

  const getAuthorizedUsers = (apiId: string): ApiUser[] => {
    return apiUsers.filter(user =>
      user.status === 'active' && user.allowedApiIds.includes(apiId)
    );
  };

  const handleDelete = (id: string) => {
    if (deleteApi(id)) {
      toast.success("API 已删除");
      loadApis();
    } else {
      toast.error("删除失败");
    }
    setDeleteId(null);
  };

  const handleEdit = (api: Api) => {
    setEditingApi(api);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingApi(null);
    }
  };

  const copyApiUrl = (path: string) => {
    const url = `${window.location.origin}/api${path}`;
    navigator.clipboard.writeText(url);
    toast.success("API 地址已复制");
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-green-100 text-green-700",
      POST: "bg-blue-100 text-blue-700",
      PUT: "bg-orange-100 text-orange-700",
      DELETE: "bg-red-100 text-red-700",
    };
    return colors[method] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">API 管理</h1>
          <p className="text-gray-600 mt-2">创建和管理您的数据 API 端点</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingApi(null)}>
              <Plus className="size-4 mr-2" />
              创建 API
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingApi ? "编辑 API" : "创建新 API"}
              </DialogTitle>
            </DialogHeader>
            <ApiForm
              api={editingApi}
              onSuccess={() => {
                loadApis();
                setIsDialogOpen(false);
                setEditingApi(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {apis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code className="size-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无 API</h3>
            <p className="text-gray-500 text-center mb-6">
              创建您的第一个数据 API 端点
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              创建 API
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apis.map((api) => (
            <Card key={api.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getMethodColor(api.method)}>
                        {api.method}
                      </Badge>
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded font-mono">
                      <span className="text-gray-400">/api</span>
                      {api.path}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 px-2"
                        onClick={() => copyApiUrl(api.path)}
                      >
                        <Copy className="size-3" />
                      </Button>
                    </div>
                    {api.description && (
                      <p className="text-sm text-gray-500 mt-2">{api.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(api)}
                    >
                      <Pencil className="size-3 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(api.id)}
                    >
                      <Trash2 className="size-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-green-400 font-mono whitespace-pre">
                    {api.query}
                  </code>
                </div>

                {(() => {
                  const authorizedUsers = getAuthorizedUsers(api.id);
                  return (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="size-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          授权用户 ({authorizedUsers.length})
                        </span>
                      </div>
                      {authorizedUsers.length === 0 ? (
                        <p className="text-sm text-gray-500">暂无授权用户</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {authorizedUsers.map((user) => (
                            <Badge
                              key={user.id}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {user.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该 API 端点。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
