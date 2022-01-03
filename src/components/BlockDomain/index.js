import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {View} from 'react-native';

import BlockDomain from '../Blocking/BlockDomain';
import ReportDomain from '../Blocking/ReportDomain';
import SpecificIssue from '../Blocking/SpecificIssue';
import blockUtils from '../../service/utils/blockUtils';

class BlockDomainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageReport : '',
            reportOption : [],
        }

        this.refBlockDomain = React.createRef();
        this.refSpecificIssue = React.createRef();
        this.refReportDomain = React.createRef();

        this.__getSpecificIssue = this.__getSpecificIssue.bind(this)
        this.__onNextQuestion = this.__onNextQuestion.bind(this)
        this.__onSkipOnlyBlock = this.__onSkipOnlyBlock.bind(this)
        this.__onSelectBlock = this.__onSelectBlock.bind(this);
        this.__onBlockDomain = this.__onBlockDomain.bind(this);
    }

    openBlockDomain() {
        this.refBlockDomain.current.open()
    }

    __getSpecificIssue(v) {
        this.setState({
            messageReport : v
        })
        this.refSpecificIssue.current.close();
        setTimeout(() => {
            this.__onBlockDomain();
        }, 500);
    }

    __onNextQuestion(v) {
        this.setState({
            reportOption : v
        })
        this.refReportDomain.current.close();
        this.refSpecificIssue.current.open();
    }

    __onSelectBlock(v) {
        if (v === 1) {
            this.__onBlockDomain();
        } else {
            this.refReportDomain.current.open();
        }
        this.refBlockDomain.current.close();
    }

    __onSkipOnlyBlock() {
        this.refReportDomain.current.close();
        this.refSpecificIssue.current.close();
        this.__onBlockDomain();
    }

    __onBlockDomain() {
        blockUtils.uiBlockDomain(
            this.props.domainId,
            this.state.reportOption,
            this.state.messageReport,
            this.props.screen || "domain_screen",
            () => {}
        )
    }


    render() {
        return (
            <View>
            <BlockDomain
                refBlockDomain={this.refBlockDomain}
                onSelect={this.__onSelectBlock}
                domain={this.props.domain} />
            <SpecificIssue
                refSpecificIssue={this.refSpecificIssue}
                onPress={this.__getSpecificIssue}
                onSkip={this.__onSkipOnlyBlock} />
            <ReportDomain
                refReportDomain={this.refReportDomain}
                onSkip={this.__onSkipOnlyBlock}
                onSelect={this.__onNextQuestion} />
            </View>
        );
    }
}

export default BlockDomainComponent