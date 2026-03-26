import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, setValue } from "./features/counter/counterSlice";
import { Button, Typography, InputNumber, message } from "antd";
import { useEffect } from "react";

const { Title } = Typography;

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (count !== 0 && count % 10 === 0) {
      message.success(` Count reached ${count}!`);
    }
  }, [count]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title level={2}>Global Counter</Title>

      <Title level={3}>{count}</Title>

      <Button type="primary" onClick={() => dispatch(increment())}>
        Increment
      </Button>

      <Button danger style={{ marginLeft: "10px" }} onClick={() => dispatch(decrement())}>
        Decrement
      </Button>

      <div style={{ marginTop: "20px" }}>
        <InputNumber
          min={0}
          placeholder="Set value"
          onChange={(value) => dispatch(setValue(value))}
        />
      </div>
    </div>
  );
}

export default App;