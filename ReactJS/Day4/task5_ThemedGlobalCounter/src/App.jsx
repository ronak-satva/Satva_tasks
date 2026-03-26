import { useSelector, useDispatch } from "react-redux";
import { Button, Statistic, Switch, Space, Card } from "antd";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";
import { increment, decrement, reset, toggleLock } from "./features/counter/counterSlice";

function App() {
  const dispatch = useDispatch();

  const { value, isLocked } = useSelector((state) => state.counter);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <Card title="Themed Global Counter" style={{ width: 400, textAlign: "center" }}>
        
        <Statistic title="Current Value" value={value} />

        <br />

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => dispatch(increment())}
            disabled={isLocked}
          >
            Increment
          </Button>

          <Button
            danger
            icon={<MinusOutlined />}
            onClick={() => dispatch(decrement())}
            disabled={isLocked}
          >
            Decrement
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => dispatch(reset())}
          >
            Reset
          </Button>
        </Space>

        <br />
        <br />

        <Space>
          <span>Lock Counter</span>
          <Switch
            checked={isLocked}
            onChange={() => dispatch(toggleLock())}
          />
        </Space>

      </Card>
    </div>
  );
}

export default App;