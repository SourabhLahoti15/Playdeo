import React from "react";
import { Dimensions, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const windowWidth = Dimensions.get("window").width;

const VideoSkeleton = () => {
  return (
    <View style={{ backgroundColor: "#000" }}>

      <SkeletonPlaceholder
        backgroundColor="#1e1e1e"
        highlightColor="#2c2c2c"
      >

        {/* HEADER */}
        <SkeletonPlaceholder.Item padding={8} flexDirection="row" justifyContent="space-between" alignItems="center">

          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
            <SkeletonPlaceholder.Item marginLeft={10} width={100} height={12} borderRadius={5} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item width={70} height={25} borderRadius={5} marginRight={10} />
            <SkeletonPlaceholder.Item width={20} height={20} />
          </SkeletonPlaceholder.Item>

        </SkeletonPlaceholder.Item>

        {/* VIDEO THUMBNAIL / PLAYER */}
        <SkeletonPlaceholder.Item marginTop={10} width={windowWidth} height={220} />

        {/* TITLE */}
        <SkeletonPlaceholder.Item marginTop={10} marginLeft={8} width="70%" height={15} borderRadius={5} />
        <SkeletonPlaceholder.Item marginTop={6} marginLeft={8} width="50%" height={15} borderRadius={5} />

        {/* FOOTER */}
        <SkeletonPlaceholder.Item marginTop={10} paddingHorizontal={12} flexDirection="row" justifyContent="space-between">

          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item width={25} height={25} borderRadius={5} marginRight={15} />
            <SkeletonPlaceholder.Item width={25} height={25} borderRadius={5} marginRight={15} />
            <SkeletonPlaceholder.Item width={25} height={25} borderRadius={5} marginRight={15} />
            <SkeletonPlaceholder.Item width={25} height={25} borderRadius={5} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item width={25} height={25} borderRadius={5} />

        </SkeletonPlaceholder.Item>

      </SkeletonPlaceholder>

    </View>
  );
};

export default VideoSkeleton;