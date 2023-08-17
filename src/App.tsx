import React, { useEffect, useState } from "react";
import { Tree, Divider, Steps, Input, Button, Modal, Layout } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./assets/base.scss";

const { Search } = Input;
const { Step } = Steps;
const { Content } = Layout;

// 本地静态数据
const mockData = [
  {
    permissionRestInfList:
      '[{"resourceId":2,"restId":"1","resourceNm":"测试数据1","permission":"2","serviceId":"bou","restNm":"测试数据2"}]',
    resourceId: "1",
    resourceNm: "测试数据数组1",
  },
  {
    permissionRestInfList:
      '[{"resourceId":3,"restId":"2","resourceNm":"测试数据3","permission":"3","serviceId":"bou","restNm":"测试数据4"}]',
    resourceId: "3",
    resourceNm: "测试数据数组2",
  },
];

export default function selectTree() {
  // 定义默认选中的数据
  const [checkedKeys, setCheckedKeys]: any = useState([
    "BOOPNDTL/开户结果明细查询",
  ]);

  // 定义树型图选中的key值变量
  const [selectedKeys, setSelectedKeys]: any = useState([]);

  // 定义树型数据变量
  const [treeData, setTreeData]: any = useState([]);

  // 初始化数据
  useEffect(() => {
    setTreeData(
      mockData.map((item: any) => {
        return {
          permissionRestInfList: JSON.parse(item.permissionRestInfList),
          resourceId: item.resourceId,
          resourceNm: item.resourceNm,
          title: item.resourceNm,
          key: item.resourceNm,
          pid: "",
          pNm: "",
          disabled: false,
          children: JSON.parse(item.permissionRestInfList).map((i: any) => {
            return {
              title: i.restId + "/" + i.restNm,
              key: i.restId + "/" + i.restNm,
              resourceId: i.resourceId,
              restId: i.restId,
              resourceNm: i.resourceNm,
              permission: i.permission,
              serviceId: i.serviceId,
              restNm: i.restNm,
              pid: i.resourceId,
              pNm: i.resourceNm,
              disabled: i.permission === "1",
            };
          }),
        };
      })
    );
  }, []);


  // 监听树型数据的变化控制树型的可选中状态
  useEffect(() => {
    if (treeData) {
      let defList: any = [];
      treeData.map((i: any) => {
        let count = 0;
        let len = i.children.length;
        i.children.forEach((item: any) => {
          if (item.permission === "1") {
            count++;
            defList.push(item.key);
            // console.log("defList", defList);
          }
        });
        if (len === count) {
          i.permission = "1";
          i.disabled = true;
        } else {
          i.permission = "0";
          i.disabled = false;
        }
      });
    }
    // console.log("treeData: ", treeData);
  }, [treeData]);

  // 点击树节点的复选框选中数据
  const onCheck = (checkedKeysValue: any, e: any) => {
    setCheckedKeys(checkedKeysValue);
    let checkList = e.checkedNodes;
    checkList = checkList.filter((item: any) => {
      return item.pid !== "";
    });
    setSelectList(checkList);
  };

  // 树节点的选中事件
  const onSelect = (selectedKeysValue: React.Key[], info: any) => { };

  // 定义清除全部的方法
  const deleteAll = () => {
    setCheckedKeys([]);
    setSelectList([]);
  };

  // 删除对应的节点数据的方法
  const deleteById: any = (e: any) => {
    // 删除右边的数组
    let rightList = JSON.parse(JSON.stringify(selectList));
    let pNm: any;
    //获取选中元素的下标和pNm
    let index = rightList.findIndex((i: any) => {
      // 找到点击的父节点
      if (i.key === e.key) pNm = i.pNm;
      return i.key === e.key;
    });
    //删除右边元素
    rightList.splice(index, 1);
    setSelectList(rightList);
    let leftList = JSON.parse(JSON.stringify(checkedKeys));
    leftList.splice(leftList.indexOf(e.key), 1);
    //当全选时，删除一次pNm
    if (leftList.indexOf(pNm) >= 0) leftList.splice(leftList.indexOf(pNm), 1);
    setCheckedKeys(leftList);
  };


  //定义弹窗的显示控制变量
  const [isModalVisible, setIsModalVisible] = useState(true);

  // 定义选中的数量控制是否显示树型图
  const [current, setCurrent] = useState(0);

  // 定义选中数据
  const [selectList, setSelectList] = useState([]);

  // 确定的事件处理
  const handleOk = () => { };

  // 点击取消的事件处理
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        打开树形弹框
      </Button>
      <Modal
        title="树型选择框"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <div
          style={{
            margin: "24px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Steps current={0} style={{ width: "50%" }}>
            <Step title="树型数据" />
            <Step title="选中数据" />
          </Steps>
        </div>
        <Divider style={{ margin: "0" }} />
        {current === 0 && (
          <div
            style={{
              display: "flex",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                flex: "1",
                borderRight: "1px solid #ccc",
                paddingRight: "24px",
              }}
            >
              <Search style={{ margin: "24px 0" }} placeholder="Search" />
              <Tree
                checkable
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
              />
            </div>
            <div style={{ flex: "1", overflow: "auto" }}>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>已选择({selectList.length})</span>
                <span style={{ cursor: "pointer" }} onClick={deleteAll}>
                  清空
                </span>
              </div>
              {selectList.map((item: any, index) => (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  key={index}
                >
                  <>
                    <div>{item.pNm + " &&&& " + item.key}</div>
                    <span onClick={() => deleteById(item)}>
                      <CloseOutlined />
                    </span>
                  </>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}