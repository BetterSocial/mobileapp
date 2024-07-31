/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {InteractionManager, View} from 'react-native';

import BlockDomain from '../Blocking/BlockDomain';
import ReportDomain from '../Blocking/ReportDomain';
import SpecificIssue from '../Blocking/SpecificIssue';
import blockUtils from '../../service/utils/blockUtils';
import {checkBlockDomainPage} from '../../service/domain';

class BlockDomainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageReport: '',
      reportOption: []
    };

    this.refBlockDomain = React.createRef();
    this.refSpecificIssue = React.createRef();
    this.refReportDomain = React.createRef();
    this.refInteractionManager = React.createRef();

    this.__getSpecificIssue = this.__getSpecificIssue.bind(this);
    this.__onNextQuestion = this.__onNextQuestion.bind(this);
    this.__onSkipOnlyBlock = this.__onSkipOnlyBlock.bind(this);
    this.__onSelectBlock = this.__onSelectBlock.bind(this);
    this.__onBlockDomain = this.__onBlockDomain.bind(this);
  }

  componentWillUnmount() {
    if (this.refInteractionManager.current) this.refInteractionManager.current.cancel();
  }

  openBlockDomain() {
    this.refInteractionManager.current = InteractionManager.runAfterInteractions(() => {
      this.refBlockDomain.current.open();
    });
  }

  __getSpecificIssue(v) {
    this.setState({
      messageReport: v
    });
    this.refSpecificIssue.current.close();
    setTimeout(() => {
      this.__onBlockDomain();
    }, 500);
  }

  __onNextQuestion(v) {
    this.setState({
      reportOption: v
    });
    this.refReportDomain.current.close();
    this.refInteractionManager.current = InteractionManager.runAfterInteractions(() => {
      this.refSpecificIssue.current.open();
    });

    if (this.props.onReasonsSubmitted) this.props.onReasonsSubmitted(v);
  }

  __onSelectBlock(v) {
    if (v === 1) {
      this.__onBlockDomain();
    } else {
      this.refInteractionManager.current = InteractionManager.runAfterInteractions(() => {
        this.refReportDomain.current.open();
      });
    }
    this.refBlockDomain.current.close();
  }

  __onSkipOnlyBlock() {
    this.refReportDomain.current.close();
    this.refSpecificIssue.current.close();
    this.__onBlockDomain();
    if (this.props.onSkipOnlyBlock) this.props.onSkipOnlyBlock();
  }

  __onBlockDomain() {
    blockUtils.uiBlockDomain(
      this.props.domainId,
      this.state.reportOption,
      this.state.messageReport,
      this.props.screen || 'domain_screen',
      async () => {
        // getBlockedDomain(this.props.domainId).then((res) => {
        //     this.props.getValueBlock(res.data)
        // })

        const blockedDomain = await checkBlockDomainPage(this.props.domainId);
        this.props.getValueBlock(blockedDomain);
      }
    );

    if (this.props.onReportInfoSubmitted) this.props.onReportInfoSubmitted();
  }

  render() {
    return (
      <View>
        <BlockDomain
          refBlockDomain={this.refBlockDomain}
          onSelect={this.__onSelectBlock}
          domain={this.props.domain}
          onClose={() => this.props?.onCloseBlockDomain?.()}
          onBlockAndReportDomain={() => this.props?.onBlockAndReportDomain?.()}
          onBlockDomainIndefinitely={() => this.props?.onBlockDomainIndefinitely?.()}
        />
        <SpecificIssue
          refSpecificIssue={this.refSpecificIssue}
          onPress={this.__getSpecificIssue}
          onSkip={this.__onSkipOnlyBlock}
        />
        <ReportDomain
          ref={this.refReportDomain}
          onSkip={this.__onSkipOnlyBlock}
          onSelect={this.__onNextQuestion}
        />
      </View>
    );
  }
}

export default BlockDomainComponent;
