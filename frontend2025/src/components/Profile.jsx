import { useUser } from '../context/UserContext';
import { useScore } from '../context/ScoreContext';

function Profile() {
    const { correct, wrong} = useScore();
    const { user } = useUser();

    return (
        <div>
            <h1>Profil Sayfası</h1>
            <p>Hoşgeldin, {user?.username || 'misafir'}!</p>
            <p>Doğru Sayısı: {correct}</p>
            <p>Yanlış Sayısı: {wrong}</p>
        </div>
    );
}

export default Profile;
