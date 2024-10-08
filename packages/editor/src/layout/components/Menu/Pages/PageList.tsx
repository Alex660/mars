import { Button, Flex, List, Spin, Tag } from 'antd';
import { PlusOutlined, SyncOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import api, { PageItem } from '@/api/pageMember';
import { delPageData } from '@/api';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from '@/utils/AntdGlobal';
import { usePageStore } from '@/stores/pageStore';
import CreatePage from '../../Header/CreatePage';
/**
 * 编辑器中，快捷操作页面列表
 * 打开、修改、删除、新增页面
 */
export default () => {
  const createRef = useRef<{ open: (record?: PageItem) => void }>();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<PageItem[]>([]);
  const pageId = usePageStore((state) => state.page.pageId);
  const navigate = useNavigate();
  useEffect(() => {
    getPageList();
  }, []);

  // 获取用户页面列表
  const getPageList = async () => {
    setLoading(true);
    const res = await api.getPageList();
    setLoading(false);
    setList(res.list);
  };

  // 新增用户
  const handleAdd = (item?: PageItem) => {
    createRef.current?.open(item);
  };

  // 删除页面
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认',
      content: '删除后，将无法恢复，请谨慎操作？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await delPageData({
          id,
        });
        message.success('删除成功');
        getPageList();
        if (list.length > 0) navigate(`/editor/${list[0].id}/edit`);
      },
    });
  };

  // 在编辑器中，打开当前页面
  const handleOpen = async (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    navigate(`/editor/${id}/edit`);
  };

  return (
    <>
      <Flex justify="space-between" align="center" style={{ borderBottom: '1px solid #e8e9eb' }}>
        <Button type="link" icon={<PlusOutlined />} onClick={() => handleAdd()} style={{ marginLeft: -15 }}>
          新增
        </Button>
        <Button type="link" icon={<SyncOutlined />} onClick={getPageList}>
          刷新
        </Button>
      </Flex>
      <Spin spinning={loading}>
        <List
          style={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[
                  item.id === pageId ? <Tag color="#7D33FF">当前</Tag> : '',
                  <DeleteOutlined onClick={() => handleDelete(item.id)} />,
                  <EditOutlined onClick={() => handleAdd(item)} />,
                ]}
              >
                <List.Item.Meta title={<a onClick={(event) => handleOpen(event, item.id)}>{item.name}</a>} description={item.remark} />
              </List.Item>
            );
          }}
        />
      </Spin>
      {/* 创建和修改页面 */}
      <CreatePage createRef={createRef} update={() => getPageList()} />
    </>
  );
};
