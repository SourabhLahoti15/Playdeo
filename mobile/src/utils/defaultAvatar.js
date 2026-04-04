const defaultAvatar = (name) => {
    const trimmedName = name ? name.trim() : '';
    if (!trimmedName) return 'https://ui-avatars.com/api/?name=User&background=random';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName[0])}&size=128&format=png&rounded=true`;
}

export default defaultAvatar;