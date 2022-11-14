import React from 'react';

import OrganizationForm from "main/components/Organization/OrganizationForm"
import { organizationFixtures } from 'fixtures/organizationFixtures';

export default {
    title: 'components/Organization/OrganizationForm',
    component: OrganizationForm
};


const Template = (args) => {
    return (
        <OrganizationForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    buttonLabel: "Create",
    submitAction: (data) => { console.log('Create was clicked, parameter to submitAction=',data); }
};

export const Show = Template.bind({});

Show.args = {
    initialCommons: organizationFixtures.oneOrganization,
    buttonLabel: "Update",
    submitAction: (data) => { console.log('Update was clicked, parameter to submitAction=',data); }
};
