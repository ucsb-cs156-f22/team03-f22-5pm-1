import React from 'react';

import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm"
import { HelpRequestsFixtures } from 'fixtures/HelpRequestsFixtures';

export default {
    title: 'components/HelpRequests/HelpRequestsForm',
    component: HelpRequestsForm
};


const Template = (args) => {
    return (
        <HelpRequestsForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    buttonLabel: "Create",
    submitAction: () => { console.log("Create was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    HelpRequests: HelpRequestsFixtures.oneHelpRequests,
    buttonLabel: "",
    submitAction: () => { }
};
