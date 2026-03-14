import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Database, Code, Activity, TrendingUp } from "lucide-react";
import { getDataSources, getApis } from "../lib/storage";

export function Dashboard() {
  const [stats, setStats] = useState({
    dataSources: 0,
    apis: 0,
    queries: 0,
    activeConnections: 0,
  });

  useEffect(() => {
    const dataSources = getDataSources();
    const apis = getApis();
    setStats({
      dataSources: dataSources.length,
      apis: apis.length,
      queries: 156, // 模拟数据
      activeConnections: dataSources.filter(ds => ds.status === 'connected').length,
    });
  }, []);

  const cards = [
    {
      title: "数据源",
      value: stats.dataSources,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "API 端点",
      value: stats.apis,
      icon: Code,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "活跃连接",
      value: stats.activeConnections,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "查询次数",
      value: stats.queries,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">概览</h1>
        <p className="text-gray-600 mt-2">欢迎使用数据集市管理平台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`size-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "创建数据源", name: "MySQL Production", time: "2小时前" },
                { action: "新建 API", name: "User Data API", time: "5小时前" },
                { action: "执行查询", name: "Sales Report", time: "1天前" },
                { action: "更新数据源", name: "PostgreSQL Dev", time: "2天前" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据源状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "MySQL Production", status: "connected", type: "MySQL" },
                { name: "PostgreSQL Dev", status: "connected", type: "PostgreSQL" },
                { name: "MongoDB Analytics", status: "disconnected", type: "MongoDB" },
                { name: "REST API Service", status: "connected", type: "REST API" },
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${source.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    source.status === 'connected' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source.status === 'connected' ? '已连接' : '未连接'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
