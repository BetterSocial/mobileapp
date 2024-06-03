/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {InteractionManager, View} from 'react-native';

import BlockPostAnonymous from '../Blocking/BlockPostAnonymous';
import BlockUser from '../Blocking/BlockUser';
import ReportPostAnonymous from '../Blocking/ReportPostAnonymous';
import ReportUser from '../Blocking/ReportUser';
import SpecificIssue from '../Blocking/SpecificIssue';
import blockUtils from '../../service/utils/blockUtils';
import {getUserId} from '../../utils/users';

class BlockComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageReport: '',
      myId: '',
      postId: '',
      reportOption: -1,
      userId: '',
      username: '',
      reason: [],
      isAnonymous: false,
      isAnonymousUserFromGroupInfo: false
    };

    this.refBlockPostAnonymous = React.createRef();
    this.refBlockUser = React.createRef();
    this.refReportPostAnonymous = React.createRef();
    this.refReportUser = React.createRef();
    this.refSpecificIssue = React.createRef();
    this.refInteractionManaged = React.createRef();
    this.onIssueTimeout = null;

    this.__blockPostAnonymous = this.__blockPostAnonymous.bind(this);
    this.__blockUser = this.__blockUser.bind(this);
    this.__onIssue = this.__onIssue.bind(this);
    this.__onNextQuestion = this.__onNextQuestion.bind(this);
    this.__onSelectBlocking = this.__onSelectBlocking.bind(this);
    this.__onSelectBlockingPostAnonymous = this.__onSelectBlockingPostAnonymous.bind(this);
    this.__onSkipOnlyBlock = this.__onSkipOnlyBlock.bind(this);
  }

  componentDidMount() {
    this.__parseToken();
  }

  componentWillUnmount() {
    clearTimeout(this.onIssueTimeout);
    if (this.refInteractionManaged.current) this.refInteractionManaged.current.cancel();
  }

  setDataToState(value) {
    if (value.anonimity === true) {
      this.setState({
        postId: value.id,
        userId: `${value.actor.id}-anonymous`,
        username: 'Anonymous'
      });
    } else {
      this.setState({
        postId: value.id,
        userId: value.actor.id,
        username: value.actor.data.username
      });
    }
  }

  openBlockComponent(value) {
    if (value.actor.id === this.state.myId) {
      Toast.show("Can't Block yourself", Toast.LONG);
      return;
    }

    if (value.isAnonymousUserFromGroupInfo) {
      this.setState({isAnonymousUserFromGroupInfo: true});
      this.setDataToState(value);
      this.refInteractionManaged.current = InteractionManager.runAfterInteractions(() => {
        this.refBlockPostAnonymous.current.open();
      });
      return;
    }

    this.setDataToState(value);
    if (value.anonimity) {
      this.setState({isAnonymous: true});
      this.refBlockPostAnonymous.current.open();
    } else {
      this.setState({isAnonymous: false});
      this.refBlockUser.current.open();
    }
  }

  openReportAnonymousPost() {
    this.refBlockPostAnonymous().current.open();
  }

  async __parseToken() {
    const id = await getUserId();
    if (id) {
      this.setState({
        myId: id
      });
    }
  }

  __onSelectBlocking(v) {
    if (v !== 1) {
      this.refInteractionManaged.current = InteractionManager.runAfterInteractions(() => {
        this.refReportUser.current.open();
      });
    } else {
      this.__blockUser();
    }
    this.refBlockUser.current.close();
  }

  __onSelectBlockingPostAnonymous(v) {
    if (v !== 1) {
      this.refInteractionManaged.current = InteractionManager.runAfterInteractions(() => {
        this.refReportPostAnonymous.current.open();
      });
    } else {
      if (this.state.isAnonymousUserFromGroupInfo) {
        this.__blockAnonymousUserFromGroupInfo();
        this.refBlockPostAnonymous.current.close();
        return;
      }

      this.__blockPostAnonymous();
    }
    this.refBlockPostAnonymous.current.close();
  }

  __onNextQuestion(v) {
    this.setState({
      reason: v
    });
    this.refReportUser.current.close();
    this.refReportPostAnonymous.current.close();
    this.refInteractionManaged.current = InteractionManager.runAfterInteractions(() => {
      this.refSpecificIssue.current.open();
    });

    if (this.props.onReasonsSubmitted) this.props.onReasonsSubmitted(v);
  }

  __onSkipOnlyBlock() {
    this.refReportUser.current.close();
    if (this.state.isAnonymousUserFromGroupInfo) return this.__blockAnonymousUserFromGroupInfo();
    if (this.state.isAnonymous) return this.__blockPostAnonymous();
    if (this.props.onSkipOnlyBlock) this.props.onSkipOnlyBlock();

    return this.__blockUser();
  }

  __onIssue(v) {
    this.refSpecificIssue.current.close();

    this.setState({
      messageReport: v
    });

    this.onIssueTimeout = setTimeout(() => {
      this.refBlockUser.current.close();
      this.refBlockPostAnonymous.current.close();

      if (this.state.isAnonymousUserFromGroupInfo) return this.__blockAnonymousUserFromGroupInfo();
      if (this.state.isAnonymous) return this.__blockPostAnonymous();
      if (this.props.onReportInfoSubmitted) this.props.onReportInfoSubmitted();
      return this.__blockUser();
    }, 500);
  }

  __blockUser() {
    if (__DEV__) {
      console.log('block user called');
    }
    const {postId, userId, messageReport, reason} = this.state;
    blockUtils.uiBlockUser(
      postId,
      userId,
      this.props.screen || 'screen_feed',
      reason,
      messageReport,
      () => {
        if (this.props.refresh) {
          this.props.refresh(this.state.postId);
        }
      }
    );
  }

  __blockPostAnonymous() {
    const {postId, messageReport, reason} = this.state;
    blockUtils.uiBlockPostAnonymous(
      postId,
      this.props.screen || 'screen_feed',
      reason,
      messageReport,
      () => {
        if (this.props.refreshAnonymous) {
          this.props.refreshAnonymous(this.state.postId);
        }
      }
    );
  }

  __blockAnonymousUserFromGroupInfo() {
    const {userId, messageReport, reason} = this.state;
    blockUtils.uiBlockAnonymousUserFromGroupInfo(
      userId,
      this.props.screen || 'group_info',
      reason,
      messageReport,
      () => {
        if (this.props.refreshAnonymous) {
          this.props.refreshAnonymous(this.state.postId);
        }
      }
    );
  }

  render() {
    return (
      <View>
        <BlockPostAnonymous
          refBlockPostAnonymous={this.refBlockPostAnonymous}
          onSelect={this.__onSelectBlockingPostAnonymous}
          onBlockAndReportUser={() => this.props?.onBlockAndReportUser?.()}
          onBlockUserIndefinitely={() => this.props?.onBlockUserIndefinitely?.()}
        />

        <BlockUser
          refBlockUser={this.refBlockUser}
          onSelect={this.__onSelectBlocking}
          username={this.state.username}
          onClose={() => this.props?.onCloseBlockUser?.()}
          onBlockAndReportUser={() => this.props?.onBlockAndReportUser?.()}
          onBlockUserIndefinitely={() => this.props?.onBlockUserIndefinitely?.()}
        />
        <ReportUser
          ref={this.refReportUser}
          onSelect={this.__onNextQuestion}
          onSkip={this.__onSkipOnlyBlock}
        />
        <ReportPostAnonymous
          refReportPostAnonymous={this.refReportPostAnonymous}
          onSelect={this.__onNextQuestion}
          onSkip={this.__onSkipOnlyBlock}
        />
        <SpecificIssue
          refSpecificIssue={this.refSpecificIssue}
          onPress={this.__onIssue}
          onSkip={this.__onSkipOnlyBlock}
        />
      </View>
    );
  }
}

export default BlockComponent;
