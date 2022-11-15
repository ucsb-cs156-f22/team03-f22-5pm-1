import React from 'react';

import MenuItemForm from "main/components/MenuItem/MenuItemForm"
import { MenuItemFixtures } from 'fixtures/MenuItemFixtures';

export default {
    title: 'components/MenuItem/MenuItemForm',
    component: MenuItemForm
};


const Template = (args) => {
    return (
        <MenuItemForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    menuitems: MenuItemFixtures.oneMenuItem,
    submitText: "",
    submitAction: () => { }
};
