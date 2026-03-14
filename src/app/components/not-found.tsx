import { Link } from "react-router";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">页面未找到</p>
        <Link to="/">
          <Button>返回首页</Button>
        </Link>
      </div>
    </div>
  );
}
