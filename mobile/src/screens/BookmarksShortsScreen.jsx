import React, { useEffect, useState } from 'react'
import ShortsList from "../components/ShortsList";
import BASE_URL from '../api/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookmarksShortsScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const { token, index } = route.params;
    const [shorts, setShorts] = useState([]);
    const [page, setPage] = useState(1);

    const getBookmarkedShorts = async () => {
        const res = await fetch(`${BASE_URL}/api/bookmarks/shorts?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setShorts(prev => [...prev, ...data]);
    };

    useEffect(() => {
        getBookmarkedShorts();
    }, [page]);

    return (
        <ShortsList
            shorts={shorts}
            setShorts={setShorts}
            initialIndex={index}
            bottomOffset={insets.bottom}
            onEndReached={() => setPage(prev => prev + 1)}
        />
    );
};

export default BookmarksShortsScreen;