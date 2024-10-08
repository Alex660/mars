import MColorPicker from '@/components/ColorPicker';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Space } from 'antd';
import { memo } from 'react';
export default memo(() => {
  return (
    <Form.Item label="颜色">
      <Form.List name={['color']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8, padding: '0 10px' }}>
                <Form.Item noStyle {...restField} name={[name]}>
                  <MColorPicker style={{ width: '120px' }} />
                </Form.Item>
                <PlusOutlined onClick={() => add('#f16622', name + 1)} />
                {name > 0 && <MinusOutlined onClick={() => remove(name)} />}
              </Space>
            ))}
          </>
        )}
      </Form.List>
    </Form.Item>
  );
});
