import React from 'react';

import OrganizationTable from "main/components/Organization/OrganizationTable";
import { organizationFixtures } from 'fixtures/organizationFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Organization/OrganizationTable',
    component: OrganizationTable
};

const Template = (args) => {
    return (
        <OrganizationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    organization: []
};

export const ThreeOrgs = Template.bind({});

ThreeOrgs.args = {
    organization: organizationFixtures.threeOrganizations
};

export const ThreeOrgsAsAdmin = Template.bind({});

ThreeOrgsAsAdmin.args = {
    organization: organizationFixtures.threeOrganizations,
    currentUser: currentUserFixtures.adminUser
};

