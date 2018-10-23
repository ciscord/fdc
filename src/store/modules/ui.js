
const state = {
    navbarTitle: 'Freelance Developer Coach'
};

const getters = {
    navbarTitle: state => state.navbarTitle
};

const mutations = {
    setNavbarTitle (state, title) {
        state.navbarTitle = title;
    }
};

const actions = {
    setNavbarTitle ({ commit }, title) {
        commit('setNavbarTitle', title || 'Freelance Developer Coach');
    }
};

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}