import { useState } from "react";
import { Play, Download, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { getDataSources } from "../lib/storage";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function QueryEditor() {
  const dataSources = getDataSources();
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  // 模拟查询结果
  const mockResults = [
    { id: 1, name: "张三", email: "zhangsan@example.com", role: "管理员", status: "活跃" },
    { id: 2, name: "李四", email: "lisi@example.com", role: "用户", status: "活跃" },
    { id: 3, name: "王五", email: "wangwu@example.com", role: "用户", status: "禁用" },
    { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "编辑", status: "活跃" },
    { id: 5, name: "孙七", email: "sunqi@example.com", role: "用户", status: "活跃" },
  ];

  const handleExecuteQuery = () => {
    if (!selectedDataSource) {
      toast.error("请选择数据源");
      return;
    }
    if (!query.trim()) {
      toast.error("请输入查询语句");
      return;
    }

    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
      toast.success("查询执行成功");
    }, 1000);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    toast.success("查询语句已复制");
  };

  const handleExportResults = () => {
    if (!results) return;
    
    const csv = [
      Object.keys(results[0]).join(','),
      ...results.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    a.click();
    toast.success("结果已导出");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">查询编辑器</h1>
        <p className="text-gray-600 mt-2">执行 SQL 查询并查看结果</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SQL 编辑器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  选择数据源
                </label>
                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择一个数据源" />
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    SQL 查询
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyQuery}
                  >
                    <Copy className="size-3 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder="输入 SQL 查询语句..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleExecuteQuery}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Play className="size-4 mr-2" />
                  {isLoading ? "执行中..." : "执行查询"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>查询结果 ({results.length} 条)</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportResults}
                  >
                    <Download className="size-3 mr-1" />
                    导出 CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(results[0]).map((key) => (
                            <TableHead key={key} className="font-semibold">
                              {key}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value: any, i) => (
                              <TableCell key={i}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>查询历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { query: "SELECT * FROM users", time: "2分钟前" },
                  { query: "SELECT COUNT(*) FROM orders", time: "15分钟前" },
                  { query: "SELECT * FROM products WHERE...", time: "1小时前" },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setQuery(item.query)}
                  >
                    <p className="text-sm font-mono text-gray-900 truncate">
                      {item.query}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快捷模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: "查询所有", query: "SELECT * FROM table_name LIMIT 10;" },
                  { label: "计数", query: "SELECT COUNT(*) FROM table_name;" },
                  { label: "分组统计", query: "SELECT column, COUNT(*) FROM table_name GROUP BY column;" },
                  { label: "连接查询", query: "SELECT * FROM table1 JOIN table2 ON table1.id = table2.id;" },
                ].map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setQuery(template.query)}
                  >
                    {template.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
