import { Outlet, NavLink } from "react-router";
import { Database, Home, Code, Search, Users } from "lucide-react";
import { cn } from "./ui/utils";

export function Layout() {
  const navItems = [
    { path: "/", label: "概览", icon: Home },
    { path: "/data-sources", label: "数据源", icon: Database },
    { path: "/apis", label: "API 管理", icon: Code },
    { path: "/api-users", label: "API 用户", icon: Users },
    { path: "/query", label: "查询编辑器", icon: Search },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-semibold text-xl text-gray-900">数据集市</h1>
          <p className="text-sm text-gray-500 mt-1">Data Marketplace</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("size-5", isActive ? "text-blue-700" : "text-gray-500")} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">版本 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
