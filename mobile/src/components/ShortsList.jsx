import React, { useRef, useState } from 'react'
import { View, FlatList } from "react-native";
import ShortItem from './ShortItem'

const ShortsList = ({ shorts, initialIndex = 0, bottomOffset = 0, onEndReached }) => {
    // const windowHeight = Dimensions.get("window").height;
    const [listHeight, setListHeight] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(e) => {
                setListHeight(e.nativeEvent.layout.height);
            }}
        >
            <FlatList
                data={shorts}
                renderItem={({ item, index }) => {
                    return (
                        <ShortItem
                            item={item}
                            isActive={index === currentIndex}
                            listHeight={listHeight}
                            bottomOffset={bottomOffset}
                        />
                    )
                }
                }
                keyExtractor={(item) => item._id}
                initialScrollIndex={initialIndex}
                getItemLayout={(data, index) => ({
                    length: listHeight,
                    offset: listHeight * index,
                    index,
                })}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
            />
        </View>
    )
}


export default ShortsList
