import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoIc_interface from '../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../assets/icons/Ic_question_mark';
import MemoIc_user_group from '../../assets/icons/Ic_user_group';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import Gap from '../../components/Gap';
import {fonts} from '../../utils/fonts';
import {useRoute} from '@react-navigation/native';
import {getDetailDomains} from '../../service/domain';
import Loading from '../Loading';

const {width, height} = Dimensions.get('window');

const Navigation = ({domain}) => (
  <View style={styles.Header}>
    <MemoIc_arrow_back width={18} height={18} />
    <View style={styles.domain}>
      <Text style={styles.domainText}>{domain}</Text>
    </View>
  </View>
);
const Header = ({image, domain, description, followers, onPress}) => (
  <View style={styles.headerDomain}>
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1.3}}>
        <Image
          source={{
            uri: image
              ? image
              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
          }}
          style={{width: 80, height: 80, borderRadius: 45}}
        />
      </View>
      <View style={styles.wrapperHeader}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => onPress(1)}>
          <Text style={{fontSize: 14, color: 'white'}}>Follow</Text>
        </TouchableOpacity>
        <Gap style={{width: 8}} />
        <TouchableOpacity style={styles.buttonBlock} onPress={() => onPress(0)}>
          <Text style={{fontSize: 14, color: '#FF2E63'}}>Block</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: fonts.inter[600],
          fontWeight: 'bold',
        }}>
        {domain}
      </Text>
      <View style={{marginStart: 8, justifyContent: 'center'}}>
        <MemoIc_interface width={22} height={22} />
      </View>
    </View>

    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          color: '#00ADB5',
          fontFamily: fonts.inter[400],
          fontSize: 16,
          fontWeight: '700',
        }}>
        {followers}k
      </Text>
      <Gap style={{width: 4}} />
      <Text>Followers</Text>
    </View>
    <Gap style={{height: 8}} />
    <Text style={{fontSize: 14, fontFamily: fonts.inter[400], lineHeight: 16}}>
      {description}
    </Text>
    <Gap style={{height: 8}} />
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <MemoIc_rectangle_gradient width={width * 0.75} height={20} />
      <Gap style={{width: 4}} />
      <MemoIc_question_mark width={16} height={16} />
    </View>
  </View>
);

const DomainScreen = () => {
  const route = useRoute();
  const [item, setItem] = useState(route.params.item);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const RenderItem = ({domain}) => (
    <View style={{height: 30, width: width}}>
      <Text>{domain.content.author}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navigation domain={item.og.domain} />
      <Header
        description={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placeraterat tellus, non consequat mi sollicitudin quis.'
        }
        domain={item.og.domain}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'white',
  },
  Header: {
    flexDirection: 'row',
    height: 35,
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontSize: 16,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    lineHeight: 19,
  },
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  buttonPrimary: {
    height: 32,
    backgroundColor: '#00ADB5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonBlock: {
    flex: 1,
    height: 32,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#FF2E63',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapperHeader: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default DomainScreen;
