import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Key,
  ContentCopy,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { ApiUserForm } from './api-user-form';
import {
  ApiUser,
  getApiUsers,
  saveApiUser,
  updateApiUser,
  deleteApiUser,
  regenerateApiKey,
  getApis,
} from '../lib/storage';
import { toast } from 'sonner';

export function ApiUsers() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | undefined>();
  const [viewKeyDialog, setViewKeyDialog] = useState<{
    open: boolean;
    user?: ApiUser;
  }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId?: string;
  }>({ open: false });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsers = () => {
    setUsers(getApiUsers());
  };

  const handleCreateUser = (userData: Omit<ApiUser, 'id' | 'apiKey' | 'createdAt' | 'updatedAt'>) => {
    const newUser = saveApiUser(userData);
    loadUsers();
    toast.success('API 用户创建成功');
    setViewKeyDialog({ open: true, user: newUser });
  };

  const handleUpdateUser = (userData: Omit<ApiUser, 'id' | 'apiKey' | 'createdAt' | 'updatedAt'>) => {
    if (editingUser) {
      updateApiUser(editingUser.id, userData);
      loadUsers();
      setEditingUser(undefined);
      toast.success('API 用户更新成功');
    }
  };

  const handleDeleteUser = () => {
    if (deleteDialog.userId) {
      deleteApiUser(deleteDialog.userId);
      loadUsers();
      setDeleteDialog({ open: false });
      toast.success('API 用户已删除');
    }
  };

  const handleRegenerateKey = (userId: string) => {
    const updatedUser = regenerateApiKey(userId);
    if (updatedUser) {
      loadUsers();
      toast.success('API Key 已重新生成');
      setViewKeyDialog({ open: true, user: updatedUser });
    }
  };

  const handleEdit = (user: ApiUser) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(undefined);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const getApiCount = (apiIds: string[]) => {
    const allApis = getApis();
    return apiIds.filter(id => allApis.find(api => api.id === id)).length;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">API 用户管理</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          创建用户
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="搜索用户名或邮箱..."
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
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>用户名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>API 权限</TableCell>
              <TableCell>API Key</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? '未找到匹配的用户' : '暂无 API 用户，点击上方按钮创建'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.name}
                    </Typography>
                    {user.description && (
                      <Typography variant="caption" color="text.secondary">
                        {user.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 'active' ? '激活' : '停用'}
                      color={user.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${getApiCount(user.allowedApiIds)} 个 API`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          color: 'text.secondary',
                        }}
                      >
                        {user.apiKey.substring(0, 12)}...
                      </Typography>
                      <Tooltip title="查看完整 API Key">
                        <IconButton
                          size="small"
                          onClick={() => setViewKeyDialog({ open: true, user })}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="重新生成 API Key">
                      <IconButton
                        size="small"
                        onClick={() => handleRegenerateKey(user.id)}
                      >
                        <Refresh fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setDeleteDialog({ open: true, userId: user.id })
                        }
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ApiUserForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        initialData={editingUser}
      />

      <Dialog
        open={viewKeyDialog.open}
        onClose={() => setViewKeyDialog({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Key />
            API Key
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewKeyDialog.user && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                请妥善保管此 API Key，它将用于身份验证。
              </DialogContentText>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  position: 'relative',
                }}
              >
                {viewKeyDialog.user.apiKey}
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => copyToClipboard(viewKeyDialog.user!.apiKey)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                用户: {viewKeyDialog.user.name} ({viewKeyDialog.user.email})
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewKeyDialog({ open: false })}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除此 API 用户吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>
            取消
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
