import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, Row, Col, Typography } from 'antd';
const { Text } = Typography;

const LocationFilter = ({ states, selectedState, handleStateMenuClick }: any) => {

    let selectedState_name = "All states";
    let selectedSuburb_name = "All suburbs";
    if (selectedState > 0) {
        selectedState_name = states[selectedState]["name"]
    }

    const stateMenuItems: MenuProps['items'] = [
        {
            label: "All state",
            key: 0
        }
    ]
    for (let k in states) {
        stateMenuItems.push({
            label: states[k]["name"],
            key: k,
        })
    }
    const stateMenuProps = {
        items: stateMenuItems,
        onClick: handleStateMenuClick,
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Text>
                    Showing top 3 states information. You can select a state below to to show the top 3 suburbs in the chosen state.
                </Text>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                <Dropdown menu={stateMenuProps} trigger={['click']}>
                    <Button style={{ width: "100%" }}>
                        <Space>
                            {selectedState_name}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </Row>
        </>

    )
}

export default LocationFilter;