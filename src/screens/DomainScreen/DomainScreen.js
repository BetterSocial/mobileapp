import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';

import Gap from '../../components/Gap';
import {fonts} from '../../utils/fonts';
import {useRoute} from '@react-navigation/native';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import Loading from '../Loading';

import {colors} from '../../utils/colors';
import Memoic_globe from '../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoIc_interface from '../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../assets/icons/Ic_question_mark';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import Header from './Header';
import Navigation from './Navigation';

const {width, height} = Dimensions.get('window');

const DomainScreen = () => {
  const route = useRoute();
  const [item, setItem] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res = await getDetailDomains(item.og.domain);
      if (res.code === 200) {
        setData(res.data);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [item]);

  React.useEffect(() => {
    const getProfile = async () => {
      let res = await getProfileDomain(domain);
      if (res.code === 200) {
        setProfile(res.data);
      }
    };
    getProfile();
  }, [domain]);

  const RenderItem = ({domain}) => (
    <View style={styles.wrapperItem}>
      <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
        <View
          style={{
            borderRadius: 45,
            borderWidth: 0.2,
            borderColor: 'rgba(0,0,0,0.5)',
            width: 46,
            height: 46,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: profile.logo}}
            style={[
              {height: 46, width: 46, borderRadius: 45},
              StyleSheet.absoluteFillObject,
            ]}
          />
        </View>
        <Gap style={{width: 8}} />
        <View style={{flex: 1}}>
          <Text>{domain.domain.name ? domain.domain.name : 'undefined'}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{new Date(domain.time).toLocaleDateString()}</Text>
            <View style={styles.point} />
            <Memoic_globe height={16} width={16} />
            <View style={styles.point} />

            <MemoPeopleFollow height={16} width={16} />
            <Gap style={{width: 4}} />
            <Text style={{color: '#828282'}}>12k</Text>
          </View>
          <MemoIc_rectangle_gradient width={width * 0.43} height={20} />
        </View>
        <View>
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                borderColor: '#00ADB5',
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 0.5,
              }}>
              <Text style={{fontSize: 24, color: '#00ADB5'}}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingHorizontal: 16}}>
        <Text style={{fontSize: 16, fontFamily: fonts.inter[700]}}>
          {domain.content.title}
        </Text>
      </View>
      <Gap style={{height: 8}} />
      <Image
        source={{uri: domain.content.image}}
        style={{height: height * 0.3}}
      />
      <Gap style={{height: 16}} />
      <View style={{paddingHorizontal: 16}}>
        <Text>{domain.content.description}</Text>
      </View>
      <Gap style={{height: 16}} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Navigation domain={item.og.domain} />
      <Header
        image={profile.logo}
        description={profile.short_description}
        domain={profile.domain_name}
        followers={10}
        onPress={(v) => {
          console.log(v);
        }}
      />
      <Gap style={{height: 16}} />

      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return <RenderItem domain={item} />;
        }}
        style={{flex: 1}}
        keyExtractor={(i) => i.id}
      />

      <Loading visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'white',
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  wrapperItem: {backgroundColor: 'white', marginBottom: 16},
});

export default DomainScreen;
