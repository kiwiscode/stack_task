import { message } from "antd";
import { v4 as uuidv4 } from "uuid";

export const useAntdMessageHandler = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showTaskDeletedMessage = (customMessage, duration, onClickCallback) => {
    const key = uuidv4();

    messageApi.success({
      content: (
        <div
          onClick={() => {
            onClickCallback();
            messageApi.destroy(key);
          }}
          className="custom-message-antd pointer"
        >
          <div>{customMessage}</div>
          <div style={{ display: "flex" }}>
            <svg
              fill="#fecb5f"
              width={18}
              height={18}
              version="1.1"
              viewBox="0 0 64 64"
            >
              <path d="M45.4,23.6c-2.7-2.6-6.4-4.1-10.2-4.1c-4,0-8,0-12.1,0c-0.3,0-0.7,0-1,0c1.3-1.3,2.5-2.5,3.8-3.8c0.9-0.9,0.9-2.4,0-3.2  c-0.9-0.9-2.4-0.9-3.2,0c-2.5,2.5-5,5-7.5,7.5c-0.9,0.9-0.9,2.4,0,3.2c2.6,2.6,5.1,5.1,7.8,7.8c0.9,0.9,2.4,0.9,3.2,0  c0.9-0.9,0.9-2.4,0-3.2c-1.3-1.3-2.5-2.5-3.8-3.8c3.8,0,7.4,0,11.2,0c0.6,0,1.1,0,1.7,0c6.1,0.1,11,5.7,9.7,11.8  c-0.6,3-2.4,5.4-5,6.9c-2.2,1.1-4.5,1.1-6.9,1.1c-3,0-3,4.6,0,4.6c2.4,0,4.7,0,7-0.8c3.1-1.1,5.8-3.3,7.5-6.1  C51.1,35.8,50.2,28.2,45.4,23.6z" />
            </svg>
          </div>
        </div>
      ),
      duration,
      className: "task-deleted-message",
      key,
    });
  };
  const showTaskCompletedMessage = (
    customMessage,
    duration,
    onClickCallback
  ) => {
    const key = uuidv4();

    messageApi.success({
      content: (
        <div
          onClick={() => {
            onClickCallback();
            messageApi.destroy(key);
          }}
          className="custom-message-antd  pointer"
        >
          <div>{customMessage}</div>
          <div style={{ display: "flex" }}>
            <svg
              fill="#fecb5f"
              width={18}
              height={18}
              version="1.1"
              viewBox="0 0 64 64"
            >
              <path d="M45.4,23.6c-2.7-2.6-6.4-4.1-10.2-4.1c-4,0-8,0-12.1,0c-0.3,0-0.7,0-1,0c1.3-1.3,2.5-2.5,3.8-3.8c0.9-0.9,0.9-2.4,0-3.2  c-0.9-0.9-2.4-0.9-3.2,0c-2.5,2.5-5,5-7.5,7.5c-0.9,0.9-0.9,2.4,0,3.2c2.6,2.6,5.1,5.1,7.8,7.8c0.9,0.9,2.4,0.9,3.2,0  c0.9-0.9,0.9-2.4,0-3.2c-1.3-1.3-2.5-2.5-3.8-3.8c3.8,0,7.4,0,11.2,0c0.6,0,1.1,0,1.7,0c6.1,0.1,11,5.7,9.7,11.8  c-0.6,3-2.4,5.4-5,6.9c-2.2,1.1-4.5,1.1-6.9,1.1c-3,0-3,4.6,0,4.6c2.4,0,4.7,0,7-0.8c3.1-1.1,5.8-3.3,7.5-6.1  C51.1,35.8,50.2,28.2,45.4,23.6z" />
            </svg>
          </div>
        </div>
      ),
      duration,
      className: "task-completed-message",
      key,
    });
  };

  return {
    showTaskDeletedMessage,
    showTaskCompletedMessage,
    contextHolder,
  };
};
