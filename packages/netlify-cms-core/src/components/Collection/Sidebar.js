import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { translate } from 'react-polyglot';
import { NavLink } from 'react-router-dom';
import { Icon, components, colors } from 'netlify-cms-ui-default';
import { searchCollections } from 'Actions/collections';
import CollectionSearch from './CollectionSearch';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { GitLabPipelineStatus } from "netlify-cms-backend-gitlab/src/API";

const styles = {
  sidebarNavLinkActive: css`
    color: ${colors.active};
    background-color: ${colors.activeBackground};
    border-left-color: #4863c6;
  `,
};

const SidebarContainer = styled.aside`
  ${components.card};
  width: 250px;
  padding: 8px 0 12px;
  position: fixed;
  max-height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
`;

const SidebarHeading = styled.h2`
  font-size: 23px;
  font-weight: 600;
  padding: 0;
  margin: 18px 12px 12px;
  color: ${colors.textLead};
`;

const SidebarNavList = styled.ul`
  margin: 16px 0 0;
  list-style: none;
  overflow: auto;
`;

const SidebarNavLink = styled(NavLink)`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  padding: 8px 12px;
  border-left: 2px solid #fff;
  z-index: -1;

  ${Icon} {
    margin-right: 8px;
    flex-shrink: 0;
  }

  ${props => css`
    &:hover,
    &:active,
    &.${props.activeClassName} {
      ${styles.sidebarNavLinkActive};
    }
  `};
`;

const DeploymentStatusContainer = styled.ul`
  padding-top: 20px;
  padding-left: 16px;
  border-top: 1px solid #eff0f4;
`;

class Sidebar extends React.Component {
  static propTypes = {
    collections: ImmutablePropTypes.orderedMap.isRequired,
    collection: ImmutablePropTypes.map,
    searchTerm: PropTypes.string,
    t: PropTypes.func.isRequired,
    deploymentStatus: PropTypes.string,
  };

  static defaultProps = {
    searchTerm: '',
  };

  renderLink = collection => {
    const collectionName = collection.get('name');
    return (
      <li key={collectionName}>
        <SidebarNavLink to={`/collections/${collectionName}`} activeClassName="sidebar-active">
          <Icon type="write" />
          {collection.get('label')}
        </SidebarNavLink>
      </li>
    );
  };

  render() {
    const {collections, collection, searchTerm, t} = this.props;

    let spinnerComponent = null;
    if (this.props.deploymentStatus === GitLabPipelineStatus.RUNNING) {
      spinnerComponent = <FontAwesomeIcon icon={faSyncAlt} spin/>;
    }

    let statusComponent = null;
    if (this.props.deploymentCheckIsStarted) {
      statusComponent =
        <DeploymentStatusContainer>
          Deployment status:
          <span style={{color: 'black', marginRight: 10, marginLeft: 5}}>{this.props.deploymentStatus}</span>
          {spinnerComponent}
        </DeploymentStatusContainer>;
    }

    return (
      <SidebarContainer>
        <SidebarHeading>{t('collection.sidebar.collections')}</SidebarHeading>
        <CollectionSearch
          searchTerm={searchTerm}
          collections={collections}
          collection={collection}
          onSubmit={(query, collection) => searchCollections(query, collection)}
        />
        <SidebarNavList>
          {collections
            .toList()
            .filter(collection => collection.get('hide') !== true)
            .map(this.renderLink)}
        </SidebarNavList>
        {statusComponent}
      </SidebarContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  deploymentStatus: state.deploymentCheck.status,
  deploymentCheckIsStarted: state.deploymentCheck.isStarted
});

export default translate()(connect(mapStateToProps)(Sidebar));
