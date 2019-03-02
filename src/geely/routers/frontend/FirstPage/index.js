import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import ReactFullPage from '@fullpage/react-fullpage'
import css from './FirstPage.module.less'
import history from '../../../../framework/customHistory'

@injectIntl @inject('localeStore') @observer
class FirstPage extends Component {

componentDidMount(){
}

  render () {
    return (
      <div>
        <ReactFullPage licenseKey={'OPEN-SOURCE-GPLV3-LICENSE'} render={() => (
          <ReactFullPage.Wrapper>
            <div className="section"
                 style={{...styles.section, backgroundImage: `url(${require('./images/hero-emgrand-gt-1.jpg')})`}}/>
            <div className="section"
                 style={{...styles.section, backgroundImage: `url(${require('./images/hero-x7-s.jpg')})`}}/>
          </ReactFullPage.Wrapper>
        )}/>
        <div className={css.goHomeButton} onClick={() => history.push(`/home/${this.props.localeStore.locale.key}`)}>
            <FormattedMessage id={'FirstPage.Home'}/>
        </div>
      </div>
    )
  }
}

const styles = {
  videoSection: {
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  },
  section: {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
}

export default FirstPage