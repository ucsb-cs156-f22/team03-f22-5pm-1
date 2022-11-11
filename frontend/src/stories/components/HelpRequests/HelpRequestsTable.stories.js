import React from 'react';

import HelpRequestsTable from "main/components/HelpRequests/HelpRequestsTable";
import { HelpRequestsFixtures } from 'fixtures/HelpRequestsFixtures';

export default {
    title: 'components/HelpRequests/HelpRequestsTable',
    component: HelpRequestsTable
};

const Template = (args) => {
    return (
        <HelpRequestsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    HelpRequests: []
};

export const threeHelpRequests = Template.bind({});

threeHelpRequests.args = {
    HelpRequests: HelpRequestsFixtures.threeHelpRequests
};


