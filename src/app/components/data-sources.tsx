import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DataSourceForm } from "./data-source-form";
import { getDataSources, deleteDataSource, DataSource } from "../lib/storage";
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

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadDataSources = () => {
    setDataSources(getDataSources());
  };

  useEffect(() => {
    loadDataSources();
  }, []);

  const handleDelete = (id: string) => {
    if (deleteDataSource(id)) {
      toast.success("数据源已删除");
      loadDataSources();
    } else {
      toast.error("删除失败");
    }
    setDeleteId(null);
  };

  const handleEdit = (source: DataSource) => {
    setEditingSource(source);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingSource(null);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'mysql': 'MySQL',
      'postgresql': 'PostgreSQL',
      'oracle': 'Oracle',
      'sqlserver': 'SQL Server',
      'dm': '达梦数据库',
      'doris': 'Apache Doris',
      'clickhouse': 'ClickHouse',
      'mongodb': 'MongoDB',
      'redis': 'Redis',
      'hive': 'Apache Hive',
      'greenplum': 'Greenplum',
      'elasticsearch': 'Elasticsearch',
      'rest-api': 'REST API',
      'graphql': 'GraphQL',
    };
    return labels[type] || type.toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">数据源管理</h1>
          <p className="text-gray-600 mt-2">配置和管理您的数据源连接</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSource(null)}>
              <Plus className="size-4 mr-2" />
              添加数据源
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSource ? "编辑数据源" : "添加新数据源"}
              </DialogTitle>
            </DialogHeader>
            <DataSourceForm
              dataSource={editingSource}
              onSuccess={() => {
                loadDataSources();
                setIsDialogOpen(false);
                setEditingSource(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {dataSources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="size-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据源</h3>
            <p className="text-gray-500 text-center mb-6">
              开始添加您的第一个数据源连接
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              添加数据源
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((source) => (
            <Card key={source.id} className="relative group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="size-5 text-blue-600" />
                      {source.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {getTypeLabel(source.type)}
                    </p>
                  </div>
                  <div className={`size-3 rounded-full ${
                    source.status === 'connected' 
                      ? 'bg-green-500' 
                      : source.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gray-300'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {source.config.host && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">主机:</span>
                      <span className="text-gray-900 font-medium">{source.config.host}</span>
                    </div>
                  )}
                  {source.config.port && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">端口:</span>
                      <span className="text-gray-900 font-medium">{source.config.port}</span>
                    </div>
                  )}
                  {source.config.database && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">数据库:</span>
                      <span className="text-gray-900 font-medium">{source.config.database}</span>
                    </div>
                  )}
                  {source.config.url && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">URL:</span>
                      <span className="text-gray-900 font-medium truncate max-w-[200px]">
                        {source.config.url}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(source)}
                  >
                    <Pencil className="size-3 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(source.id)}
                  >
                    <Trash2 className="size-3 text-red-600" />
                  </Button>
                </div>
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
              此操作将永久删除该数据源。相关的 API 可能会受到影响。
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
