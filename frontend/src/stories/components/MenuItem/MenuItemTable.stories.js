import React from 'react';

import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { menuItemFixtures } from 'fixtures/menuItemFixtures';

export default {
    title: 'components/MenuItem/MenuItemTable',
    component: MenuItemTable
};

const Template = (args) => {
    return (
        <MenuItemTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    dates: []
};

export const ThreeMenuItem = Template.bind({});

ThreeMenuItem.args = {
    menuitems: menuItemFixtures.threeMenuItems
};


