import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Visibility,
  Delete,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import {
  ApiCallLog,
  getApiCallLogs,
  getApis,
  getApiUsers,
  getApiCallStats,
  clearApiCallLogs,
  generateMockApiCallLogs,
  Api,
  ApiUser,
} from '../lib/storage';
import { toast } from 'sonner';

export function ApiCallLogs() {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ApiCallLog[]>([]);
  const [apis, setApis] = useState<Api[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApi, setFilterApi] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewLogDialog, setViewLogDialog] = useState<{
    open: boolean;
    log?: ApiCallLog;
  }>({ open: false });
  const [stats, setStats] = useState({
    totalCalls: 0,
    successCalls: 0,
    errorCalls: 0,
    avgResponseTime: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, filterApi, filterUser, filterStatus]);

  const loadData = () => {
    const allLogs = getApiCallLogs();
    setLogs(allLogs);
    setApis(getApis());
    setUsers(getApiUsers());
    updateStats(allLogs);
  };

  const updateStats = (logsData: ApiCallLog[]) => {
    const apiId = filterApi !== 'all' ? filterApi : undefined;
    const userId = filterUser !== 'all' ? filterUser : undefined;
    setStats(getApiCallStats(apiId, userId));
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // API 过滤
    if (filterApi !== 'all') {
      filtered = filtered.filter((log) => log.apiId === filterApi);
    }

    // 用户过滤
    if (filterUser !== 'all') {
      filtered = filtered.filter((log) => log.apiUserId === filterUser);
    }

    // 状态过滤
    if (filterStatus !== 'all') {
      if (filterStatus === 'success') {
        filtered = filtered.filter(
          (log) => log.responseStatus >= 200 && log.responseStatus < 300
        );
      } else if (filterStatus === 'error') {
        filtered = filtered.filter((log) => log.responseStatus >= 400);
      }
    }

    setFilteredLogs(filtered);
    updateStats(filtered);
  };

  const handleGenerateMockData = () => {
    generateMockApiCallLogs(50);
    loadData();
    toast.success('已生成 50 条模拟调用记录');
  };

  const handleClearLogs = () => {
    if (window.confirm('确定要清空所有调用日志吗？此操作无法撤销。')) {
      clearApiCallLogs();
      loadData();
      toast.success('调用日志已清空');
    }
  };

  const getApiName = (apiId: string) => {
    const api = apis.find((a) => a.id === apiId);
    return api?.name || '未知 API';
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || '未知用户';
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  const formatResponseTime = (time: number) => {
    return `${time}ms`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">API 调用记录</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
          >
            刷新
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGenerateMockData}
          >
            生成模拟数据
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClearLogs}
          >
            清空日志
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                总调用次数
              </Typography>
              <Typography variant="h4">{stats.totalCalls}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                成功调用
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.successCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                失败调用
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.errorCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                平均响应时间
              </Typography>
              <Typography variant="h4">{stats.avgResponseTime}ms</Typography>
              <Typography variant="caption" color="text.secondary">
                成功率: {stats.successRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 过滤器 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="搜索路径或 IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>API</InputLabel>
                <Select
                  value={filterApi}
                  label="API"
                  onChange={(e) => setFilterApi(e.target.value)}
                >
                  <MenuItem value="all">全部 API</MenuItem>
                  {apis.map((api) => (
                    <MenuItem key={api.id} value={api.id}>
                      {api.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>用户</InputLabel>
                <Select
                  value={filterUser}
                  label="用户"
                  onChange={(e) => setFilterUser(e.target.value)}
                >
                  <MenuItem value="all">全部用户</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>状态</InputLabel>
                <Select
                  value={filterStatus}
                  label="状态"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="success">成功 (2xx)</MenuItem>
                  <MenuItem value="error">失败 (4xx/5xx)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 调用日志表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>API</TableCell>
              <TableCell>用户</TableCell>
              <TableCell>方法</TableCell>
              <TableCell>路径</TableCell>
              <TableCell>状态码</TableCell>
              <TableCell>响应时间</TableCell>
              <TableCell>IP 地址</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {logs.length === 0
                        ? '暂无调用记录，点击上方"生成模拟数据"按钮创建测试数据'
                        : '未找到匹配的记录'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(log.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {getApiName(log.apiId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getUserName(log.apiUserId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.method}
                      size="small"
                      color={
                        log.method === 'GET'
                          ? 'primary'
                          : log.method === 'POST'
                          ? 'success'
                          : log.method === 'PUT'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                    >
                      {log.path}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.responseStatus}
                      size="small"
                      color={getStatusColor(log.responseStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatResponseTime(log.responseTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                    >
                      {log.ipAddress || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="查看详情">
                      <IconButton
                        size="small"
                        onClick={() => setViewLogDialog({ open: true, log })}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 查看详情对话框 */}
      <Dialog
        open={viewLogDialog.open}
        onClose={() => setViewLogDialog({ open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>API 调用详情</DialogTitle>
        <DialogContent>
          {viewLogDialog.log && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    API
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {getApiName(viewLogDialog.log.apiId)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    用户
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {getUserName(viewLogDialog.log.apiUserId)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    请求方法
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {viewLogDialog.log.method}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    请求路径
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {viewLogDialog.log.path}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    响应状态
                  </Typography>
                  <Chip
                    label={viewLogDialog.log.responseStatus}
                    size="small"
                    color={getStatusColor(viewLogDialog.log.responseStatus)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    响应时间
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {formatResponseTime(viewLogDialog.log.responseTime)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    IP 地址
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {viewLogDialog.log.ipAddress || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    调用时间
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {formatDate(viewLogDialog.log.createdAt)}
                  </Typography>
                </Grid>

                {viewLogDialog.log.requestParams && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      请求参数
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        overflow: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                        {JSON.stringify(viewLogDialog.log.requestParams, null, 2)}
                      </pre>
                    </Box>
                  </Grid>
                )}

                {viewLogDialog.log.responseData && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      响应数据
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        overflow: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                        {JSON.stringify(viewLogDialog.log.responseData, null, 2)}
                      </pre>
                    </Box>
                  </Grid>
                )}

                {viewLogDialog.log.error && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      错误信息
                    </Typography>
                    <Typography variant="body2" color="error">
                      {viewLogDialog.log.error}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewLogDialog({ open: false })}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
