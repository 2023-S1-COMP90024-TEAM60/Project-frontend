import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, Row, Col, Typography } from 'antd';
const { Text } = Typography;

const LocationFilter = ({ states, selectedState, handleStateMenuClick, suburbs, selectedSuburb, handleSuburbMenuClick }: any) => {

    let selectedStateName = "All states";
    let selectedSuburbName = "All suburbs";
    if (selectedState > 0) {
        selectedStateName = states[selectedState]["name"]
    }
    if (selectedSuburb > 0) {
        selectedSuburbName = suburbs[selectedSuburb]["name"]
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

    const suburbMenuItems: MenuProps['items'] = [
        {
            label: "All suburbs",
            key: 0
        }
    ]
    for (let k in suburbs) {
        if (suburbs[k]["state_id"] == selectedState) {
            suburbMenuItems.push({
                label: suburbs[k]["name"],
                key: k,
            })
        }
            
    }
    const suburbMenuProps = {
        items: suburbMenuItems,
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
                            {selectedStateName}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </Row>
            {suburbs &&
                <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                    <Dropdown menu={suburbMenuProps} trigger={['click']} disabled={selectedState == 0}>
                        <Button style={{ width: "100%" }}>
                            <Space>
                                {selectedSuburbName}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Row>
            }
        </>
    )
}

export default LocationFilter;