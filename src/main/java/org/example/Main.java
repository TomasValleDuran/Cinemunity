package org.example;

import org.example.model.*;
import org.example.service.ShowService;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("cinemunityDB");
        final EntityManager entityManager = factory.createEntityManager();

        Map<String, Celebrity> celebrities = new HashMap<>();
        List<User> users = new ArrayList<>();
        List<Show> shows = new ArrayList<>();
        List<Review> reviews = new ArrayList<>();

        createAdminUser(entityManager);
        createRegularUsers(entityManager, users);
        createNumberUsers(entityManager, users);
        createCelebriries(entityManager, celebrities);
        createMovies(entityManager, shows, celebrities);
        createTVShows(entityManager, shows, celebrities);
        createReviews(entityManager, shows, users, reviews);
        likeRandomReviews(entityManager, reviews, users);

        entityManager.close();

        factory.close();
    }

    public static void createAdminUser(EntityManager entityManager) {
        User user = new User("admin@gmail.com", "admin", "admin123");
        user.setAdmin();
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
    }

    public static void createRegularUsers(EntityManager entityManager, List<User> users) {
        users.add(new User("santos@gmail.com", "santos", "santos123"));
        users.add(new User("pomo@gmail.com", "pomo", "pomo1234"));
        users.add(new User("bruno@gmail.com", "bruno", "bruno123"));
        users.add(new User("paca@gmail.com", "paca", "paca1234"));
        users.add(new User("sebas@gmail.com", "sebas", "sebas123"));

        for(User user : users) {
            entityManager.getTransaction().begin();
            entityManager.persist(user);
            entityManager.getTransaction().commit();
        }
    }

    public static void createNumberUsers(EntityManager entityManager, List<User> users) {
        for (int i = 0; i < 10; i++) {
            User user = new User("user" + i + "@gmail.com", "user" + i, "user1234");
            users.add(user);
            entityManager.getTransaction().begin();
            entityManager.persist(user);
            entityManager.getTransaction().commit();
        }
    }

    public static void createCelebriries(EntityManager entityManager, Map<String, Celebrity> celebrities) {

        celebrities.put("Francis Ford Coppola", new Celebrity("Francis Ford Coppola",
                "Francis Ford Coppola is an American film director, producer, and screenwriter. He was a central figure in the New Hollywood filmmaking movement of the 1960s and 1970s, and is widely considered to be one of the greatest filmmakers of all time."));

        celebrities.put("Marlon Brando", new Celebrity("Marlon Brando",
                "Marlon Brando Jr. was an American actor and film director with a career spanning 60 years, during which he won the Academy Award for Best Actor twice."));

        celebrities.put("Al Pacino", new Celebrity("Al Pacino",
                "Alfredo James Pacino is an American actor and filmmaker. In a career spanning over five decades, he has received many awards and nominations, including an Academy Award, two Tony Awards, and two Primetime Emmy Awards."));

        celebrities.put("James Caan", new Celebrity("James Caan",
                "James Edmund Caan is an American actor. After early roles in The Glory Guys (1965), for which he received a Golden Globe nomination, El Dorado (1966), and The Rain People (1969), he came to prominence in the 1970s with significant roles in films such as Brian's Song (1971), Cinderella Liberty (1973), The Gambler (1974), Freebie and the Bean (1974), Rollerball (1975), Funny Lady (1975), A Bridge Too Far (1977) and Chapter Two (1979)."));

        celebrities.put("Richard S. Castellano", new Celebrity("Richard S. Castellano",
                "Richard Salvatore Castellano was an American actor who is best remembered for his Oscar-nominated role in Lovers and Other Strangers and his subsequent role as Peter Clemenza in The Godfather."));

        celebrities.put("Robert Duvall", new Celebrity("Robert Duvall",
                "Robert Selden Duvall is an American actor and filmmaker whose career spans more than six decades. He has been nominated for seven Academy Awards and seven Golden Globe Awards, and has won a BAFTA, a Screen Actors Guild Award, and an Emmy Award."));

        celebrities.put("Sterling Hayden", new Celebrity("Sterling Hayden",
                "Sterling Walter Hayden was an American actor and author. For most of his career as a leading"));

        celebrities.put("John Marley", new Celebrity("John Marley",
                "John Marley was an American actor who was known for his role as Phil Cavalleri in Love Story and as Jack Woltz in The Godfather."));

        celebrities.put("Richard Conte", new Celebrity("Richard Conte",
                "Richard Conte was an American actor. He appeared in more than 100 films from the 1940s through 1970s, including I'll Cry Tomorrow, Ocean's 11, and The Godfather."));

        celebrities.put("Diane Keaton", new Celebrity("Diane Keaton",
                "Diane Keaton is an American actress. Known for her idiosyncratic personality and fashion style, she has received various accolades throughout her career, including an Academy Award, a BAFTA Award, two Golden Globe Awards, and the AFI Life Achievement Award."));

        celebrities.put("Robert De Niro", new Celebrity("Robert De Niro",
                "Robert Anthony De Niro Jr. is an American actor, producer, and director. He is particularly known for his nine collaborations with filmmaker Martin Scorsese, and is the recipient of various accolades, including two Academy Awards, a Golden Globe Award, the Cecil B. DeMille Award, and a Screen Actors Guild Life Achievement Award."));

        celebrities.put("John Cazale", new Celebrity("John Cazale",
                "John Holland Cazale was an American actor. He appeared in five films over six years, all of which were nominated for the Academy Award for Best Picture: The Godfather, The Conversation, The Godfather Part II, Dog Day Afternoon, and The Deer Hunter."));

        celebrities.put("Talia Shire", new Celebrity("Talia Shire",
                "Talia Rose Shire is an American actress best known for her roles as Connie Corleone in The Godfather films and Adrian Pennino in the Rocky series."));

        celebrities.put("Lee Strasberg", new Celebrity("Lee Strasberg",
                "Lee Strasberg was a Polish-American actor, director, and theatre practitioner. He co-founded, with directors Harold Clurman and Cheryl Crawford, the Group Theatre in 1931, which was hailed as 'America's first true theatrical collective'."));

        celebrities.put("Michael V. Gazzo", new Celebrity("Michael V. Gazzo",
                "Michael Vincenzo Gazzo was an American playwright who later in life became a film and television actor."));

        celebrities.put("Andy Garcia", new Celebrity("Andy Garcia",
                "Andrés Arturo García Menéndez is a Cuban-American actor and director. He first rose to prominence playing supporting roles in the films The Godfather Part III and Internal Affairs"));

        celebrities.put("Eli Wallach", new Celebrity("Eli Wallach",
                "Eli Herschel Wallach was an American film, television and stage actor whose career spanned more than six decades, beginning in the late 1940s."));

        celebrities.put("Joe Mantegna", new Celebrity("Joe Mantegna",
                "Joseph Anthony Mantegna is an American actor, producer, writer, and director. He has received various accolades for his work, including a Tony Award and two Emmy Awards, in addition to nominations for a Pulitzer Prize and a Golden Globe Award."));

        celebrities.put("George Hamilton", new Celebrity("George Hamilton",
                "George Stevens Hamilton is an American film and television actor. His notable films include Home from the Hill, By Love Possessed, Light in the Piazza, Your Cheatin' Heart, Once Is Not Enough, Love at First Bite, Zorro"));

        celebrities.put("Bridget Fonda", new Celebrity("Bridget Fonda",
                "Bridget Jane Fonda is a retired American actress. She is known for her roles in The Godfather Part III"));

        celebrities.put("Sofia Coppola", new Celebrity("Sofia Coppola",
                "Sofia Carmina Coppola is an American screenwriter, director, producer, and former actress. The daughter of filmmakers Eleanor and Francis Ford Coppola, she made her film debut as an infant in her father's acclaimed crime drama film The Godfather."));

        celebrities.put("James Cameron", new Celebrity("James Cameron",
                "James Francis Cameron is a Canadian film director, producer, and screenwriter. He is best known for making science fiction and epic films. Cameron first gained recognition for directing The Terminator."));

        celebrities.put("Leonardo DiCaprio", new Celebrity("Leonardo DiCaprio",
                "Leonardo Wilhelm DiCaprio is an American actor, producer, and environmentalist. Known for his work in biopics and period films, DiCaprio is the recipient of numerous accolades, including an Academy Award, a British Academy Film Award, and three Golden Globe Awards."));

        celebrities.put("Kate Winslet", new Celebrity("Kate Winslet",
                "Kate Elizabeth Winslet CBE is an English actress. She is known for her work in independent films, particularly period dramas, and for her portrayals of headstrong and complicated"));

        celebrities.put("Billy Zane", new Celebrity("Billy Zane",
                "William George Zane Jr. is an American actor. He is best known for his villainous role in the epic romantic disaster film Titanic, as Caledon Hockley."));

        celebrities.put("Kathy Bates", new Celebrity("Kathy Bates",
                "Kathleen Doyle Bates is an American actress and director. She is the recipient of numerous accolades, including an Academy Award, two Primetime Emmy Awards, and two Golden Globe Awards."));

        celebrities.put("Frances Fisher", new Celebrity("Frances Fisher",
                "Frances Louise Fisher is a British-American actress. Fisher began her career in theatre and later starred as detective Deborah 'Red' Saxon in the ABC daytime soap opera The Edge of Night."));

        celebrities.put("Bill Paxton", new Celebrity("Bill Paxton",
                "William Paxton was an American actor and film director. He appeared in films such as The Terminator, Weird Science, Aliens, Near Dark, Predator 2, Tombstone, True Lies, Apollo 13, Twister, Titanic, U-571, Vertical Limit, Edge of Tomorrow, and Nightcrawler."));

        celebrities.put("Bernard Hill", new Celebrity("Bernard Hill",
                "Bernard Hill is an English film, stage and television actor. He is known for playing Yosser Hughes, the troubled" ));

        celebrities.put("Jonathan Hyde", new Celebrity("Jonathan Hyde",
                "Jonathan Hyde is an Australian-born English actor, known for roles such as Herbert Cadbury in Richie Rich, J. Bruce Ismay in the film Titanic, Culverton Smith in The Memoirs of Sherlock Holmes, Warren Westridge in Anaconda, and Sam Parrish/Van Pelt in Jumanji."));

        celebrities.put("David Warner", new Celebrity("David Warner",
                "David Hattersley Warner is an English actor, who has worked in film, television, and theatre. He attended the Royal Academy of Dramatic Art and worked in the theatre before attaining prominence on screen in 1966 through his lead performance in the Karel Reisz film Morgan: A Suitable Case for Treatment."));

        celebrities.put("Vince Gilligan", new Celebrity("Vince Gilligan",
                "Vince Gilligan is an American writer, producer, and director. He is known for his television work, specifically as creator, head writer, executive producer, and director of Breaking Bad and its spin-off Better Call Saul."));

        celebrities.put("Bryan Cranston", new Celebrity("Bryan Cranston",
                "Bryan Lee Cranston is an American actor, director, and producer. He is best known for his roles as Walter White in the AMC crime drama series Breaking Bad, Hal in the Fox sitcom Malcolm in the Middle, and Dr. Tim Whatley in the NBC sitcom Seinfeld."));

        celebrities.put("Aaron Paul", new Celebrity("Aaron Paul",
                "Aaron Paul Sturtevant is an American actor. He is best known for his roles as Jesse Pinkman in the AMC crime drama series Breaking Bad, for which he won several awards, including the Critics' Choice Television Award for Best Supporting Actor in a Drama Series (2014), and the Primetime Emmy Award for Outstanding Supporting Actor in a Drama Series."));

        celebrities.put("Anna Gunn", new Celebrity("Anna Gunn",
                "Anna Gunn is an American actress. She is best known for her role as Skyler White on the AMC drama series Breaking Bad, for which she won the Primetime Emmy Award for Outstanding Supporting Actress in a Drama Series in 2013 and 2014."));

        celebrities.put("Dean Norris", new Celebrity("Dean Norris",
                "Dean Joseph Norris is an American actor. He is well known for playing DEA agent Hank Schrader on the AMC series Breaking Bad (2008–2013), for which he received critical acclaim."));

        celebrities.put("Betsy Brandt", new Celebrity("Betsy Brandt",
                "Betsy Ann Brandt is an American actress. She portrayed Marie Schrader in Breaking Bad and appeared in the CBS sitcom Life in Pieces."));

        celebrities.put("RJ Mitte", new Celebrity("RJ Mitte",
                "Roy Frank Mitte III, known professionally as RJ Mitte, is an American actor. He is best known for his role as Walter 'Flynn' White Jr. on the AMC series Breaking Bad."));

        celebrities.put("Bob Odenkirk", new Celebrity("Bob Odenkirk",
                "Robert John Odenkirk is an American actor, comedian, writer, director, and producer. He is best known for his role as lawyer Saul Goodman on the AMC crime drama series Breaking Bad and its spin-off Better Call Saul."));

        celebrities.put("Giancarlo Esposito", new Celebrity("Giancarlo Esposito",
                "Giancarlo Giuseppe Alessandro Esposito is an American actor and director. He is best known for his portrayal of Gustavo 'Gus' Fring on the AMC series Breaking Bad, for which he won the Best Supporting Actor in a Drama award at the 2012 Critics' Choice Television Awards."));

        celebrities.put("Jonathan Banks", new Celebrity("Jonathan Banks",
                "Jonathan Ray Banks is an American actor. His first notable film roles were in the films Airplane!, 48 Hrs., and Beverly Hills Cop. He has received critical acclaim for his role as Mike Ehrmantraut in the television series Breaking Bad and its spin-off, Better Call Saul."));

        celebrities.put("David Benioff", new Celebrity("David Benioff",
                "David Benioff is an American screenwriter, television producer, writer, and director. Along with his collaborator D. B. Weiss, he is best known as the co-creator, showrunner, and writer of Game of Thrones, the HBO adaptation of George R. R. Martin's series of novels A Song of Ice and Fire."));

        celebrities.put("Emilia Clarke", new Celebrity("Emilia Clarke",
                "Emilia Isobel Euphemia Rose Clarke is an English actress. She studied at the Drama Centre London, appearing in a number of stage productions, including one by the Company of Angels."));

        celebrities.put("Kit Harington", new Celebrity("Kit Harrington",
                "Christopher Catesby Harington is an English actor. He rose to prominence for his breakthrough role as Jon Snow in the HBO television series Game of Thrones (2011–2019), which brought him international recognition and several accolades."));

        celebrities.put("Sophie Turner", new Celebrity("Sophie Turner",
                "Sophie Belinda Jonas is an English actress. She made her acting debut as Sansa Stark on the HBO epic fantasy television series Game of Thrones (2011–2019), for which she received a Primetime Emmy Award nomination for the Outstanding Supporting Actress in a Drama Series in 2019."));

        celebrities.put("Maisie Williams", new Celebrity("Maisie Williams",
                "Margaret Constance Williams is an English actress. She made her professional acting debut as Arya Stark in the HBO fantasy television series Game of Thrones (2011–2019), for which she won the EWwy Award for Best Supporting Actress in a Drama, the Portal Award for Best Supporting Actress – Television and Best Young Actor, and the Saturn Award for Best Performance by a Younger Actor."));

        celebrities.put("Lena Headey", new Celebrity("Lena Headey",
                "Lena Kathren Headey is an English actress. She is best known for her acclaimed portrayal of Cersei Lannister on the HBO epic fantasy television series Game of Thrones (2011–2019), for which she received five Primetime Emmy Award nominations and a Golden Globe Award nomination."));

        celebrities.put("Nikolaj Coster-Waldau", new Celebrity("Nikolaj Coster-Waldau",
                "Nikolaj Coster-Waldau is a Danish actor, producer, and screenwriter. He gained fame in his native Denmark for his role in the film Nightwatch (1994) and since then has become well known internationally for his role as Jaime Lannister in the HBO fantasy television series Game of Thrones, which earned him nominations for four Primetime Emmy Awards."));

        celebrities.put("Peter Dinklage", new Celebrity("Peter Dinklage",
                "Peter Hayden Dinklage is an American actor and producer. He received acclaim for portraying Tyrion Lannister on the HBO television series Game of Thrones (2011–2019), for which he won the Primetime Emmy Award for Outstanding Supporting Actor in a Drama Series a record four times."));

        celebrities.put("Iain Glen", new Celebrity("Iain Glen",
                "Iain Glen is a Scottish actor. Glen is best known for his roles as Dr. Alexander Isaacs/Tyrant in the Resident Evil films and as Ser Jorah Mormont in the HBO fantasy television series Game of Thrones."));

        celebrities.put("Alfie Allen", new Celebrity("Alfie Allen",
                "Alfie Evan Allen is an English actor. He is best known for playing Theon Greyjoy in the HBO series Game of Thrones (2011–2019), for which he received a Primetime Emmy Award nomination."));

        celebrities.put("Greg Daniels", new Celebrity("Greg Daniels",
                "Gregory Martin Daniels is an American television comedy writer, producer, and director. He is known for his work on several television series, including The Office, Saturday Night Live, The Simpsons, Parks and Recreation, and King of the Hill."));

        celebrities.put("Steve Carell", new Celebrity("Steve Carell",
                "Steven John Carell is an American actor, comedian, writer, producer, and director. He is best known for his portrayal of boss Michael Scott on the NBC sitcom The Office (2005–2013), on which he also worked as an occasional producer, writer and director."));

        celebrities.put("Rainn Wilson", new Celebrity("Rainn Wilson",
                "Rainn Dietrich Wilson is an American actor, comedian, writer, director, and producer. He is best known for his role as Dwight Schrute on the NBC sitcom The Office, for which he earned three consecutive Emmy Award nominations for Outstanding Supporting Actor in a Comedy Series."));

        celebrities.put("John Krasinski", new Celebrity("John Krasinski",
                "John Burke Krasinski is an American actor, director, producer, and screenwriter. He has received four Primetime Emmy Award nominations and two Screen Actors Guild Awards. He was named by Time magazine as one of the 100 most influential people in the world in 2018."));

        celebrities.put("Jenna Fischer", new Celebrity("Jenna Fischer",
                "Regina Marie Fischer is an American actress best known for her portrayal of Pam Beesly on the NBC sitcom The Office, for which she was nominated for the Primetime Emmy Award for Outstanding Supporting Actress in a Comedy Series in 2007."));

        celebrities.put("B.J. Novak", new Celebrity("B.J. Novak",
                "Benjamin Joseph Manaly Novak is an American actor, writer, comedian, and director. Novak is best known as one of the writers and executive producers of The Office, in which he also played Ryan Howard."));

        celebrities.put("Mindy Kaling", new Celebrity("Mindy Kaling",
                "Vera Mindy Chokalingam, known professionally as Mindy Kaling, is an American actress, comedian, writer, producer, and director. She first gained recognition starring as Kelly Kapoor in the NBC sitcom The Office, for which she also served as a writer, executive producer, and director."));

        celebrities.put("Ellie Kemper", new Celebrity("Ellie Kemper",
                "Elizabeth Claire Kemper is an American actress, comedian, and writer. She first gained prominence for her starring role as receptionist Erin Hannon in the NBC comedy series The Office (2009–2013)."));

        celebrities.put("Ed Helms", new Celebrity("Ed Helms",
                "Edward Parker Helms is an American actor, comedian, and singer. He is known for his work as a correspondent on The Daily Show as well as playing Andy Bernard in the NBC sitcom The Office and Stuart Price in The Hangover trilogy."));

        celebrities.put("Angela Kinsey", new Celebrity("Angela Kinsey",
                "Angela Faye Kinsey is an American actress. She is known for playing Angela Martin in the NBC television series The Office."));

        celebrities.put("David Crane", new Celebrity("David Crane",
                "David Crane is an American writer and producer. He is one of the creators of the television sitcom Friends, along with his longtime friend Marta Kauffman."));

        celebrities.put("Jennifer Aniston", new Celebrity("Jennifer Aniston",
                "Jennifer Joanna Aniston is an American actress, producer, and businesswoman. The daughter of actors John Aniston and Nancy Dow, she began working as an actress at an early age with an uncredited role in the 1987 film Mac and Me."));

        celebrities.put("Courteney Cox", new Celebrity("Courteney Cox",
                "Courteney Bass Cox is an American actress, producer, and director. She gained worldwide recognition for her starring role as Monica Geller on the NBC sitcom Friends, which aired from 1994 to 2004."));

        celebrities.put("Lisa Kudrow", new Celebrity("Lisa Kudrow",
                "Lisa Valerie Kudrow is an American actress, comedian, writer, and producer. She gained worldwide recognition for her starring role as Phoebe Buffay on the NBC television sitcom Friends, which aired from 1994 to 2004."));

        celebrities.put("Matt LeBlanc", new Celebrity("Matt LeBlanc",
                "Matthew Steven LeBlanc is an American actor and television host. He received international recognition for his portrayal of Joey Tribbiani on the NBC sitcom Friends, which aired from 1994 to 2004."));

        celebrities.put("Matthew Perry", new Celebrity("Matthew Perry",
                "Matthew Langford Perry is a Canadian-American actor, comedian, executive producer, screenwriter, and playwright who gained worldwide recognition for his role as Chandler Bing on the NBC television sitcom Friends, which aired from 1994 to 2004."));

        celebrities.put("David Schwimmer", new Celebrity("David Schwimmer",
                "David Lawrence Schwimmer is an American actor and director. Schwimmer began his acting career performing in school plays at Beverly Hills High School."));

        celebrities.put("James Michael Tyler", new Celebrity("James Michael Tyler",
                "James Michael Tyler is an American actor best known for his role as Gunther on the NBC sitcom Friends."));

        celebrities.put("Elliott Gould", new Celebrity("Elliott Gould",
                "Elliott Gould is an American actor. He began acting in Hollywood films during the 1960s, and has remained prolific ever since. Some of his most notable films include Bob & Carol & Ted & Alice (1969), M*A*S*H (1970), The Long Goodbye (1973), and California Split (1974)."));

        celebrities.put("Christina Pickles", new Celebrity("Christina Pickles",
                "Christina Pickles is an English actress. She is known for her role as Nurse Helen Rosenthal in the NBC medical drama St. Elsewhere, for which she received five Primetime Emmy Award for Outstanding Supporting Actress in a Drama Series nominations, and she portrayed Judy Geller on Friends."));

        celebrities.put("James L. Brooks", new Celebrity("James L. Brooks",
                "James Lawrence Brooks is an American director, producer and screenwriter. While growing up in North Bergen, New Jersey, Brooks endured a fractured family life and passed the time by reading and writing. After dropping out of New York University, he got a job as an usher at CBS, going on to write for the CBS News broadcasts."));

        celebrities.put("Dan Castellaneta", new Celebrity("Dan Castellaneta",
                "Daniel Louis Castellaneta is an American actor, voice actor, comedian and screenwriter, best known for his long-running role as Homer Simpson on the Fox Broadcasting Company animated sitcom The Simpsons."));

        celebrities.put("Julie Kavner", new Celebrity("Julie Kavner",
                "Julie Deborah Kavner is an American actress, voice actress and comedian. She first attracted notice for her role as Brenda Morgenstern, the younger sister of Valerie Harper's title character in the sitcom Rhoda, for which she won a Primetime Emmy Award for Outstanding Supporting Actress in a Comedy Series."));

        celebrities.put("Nancy Cartwright", new Celebrity("Nancy Cartwright",
                "Nancy Jean Cartwright is an American actress and voice actress. She is best known for her long-running role as Bart Simpson on the animated television series The Simpsons."));

        celebrities.put("Yeardley Smith", new Celebrity("Yeardley Smith",
                "Martha Maria Yeardley Smith is an American actress, voice actress, writer and artist best known for her long-running role as Lisa Simpson on the animated television series The Simpsons."));

        celebrities.put("Hank Azaria", new Celebrity("Hank Azaria",
                "Henry Albert Azaria is an American actor, voice actor, comedian and producer. He is known for his voice characterizations as a variety of characters in the animated sitcom The Simpsons (1989–present), which has included Moe Szyslak, Apu Nahasapeemapetilon, Chief Wiggum, Comic Book Guy, Carl Carlson and numerous others."));

        celebrities.put("Harry Shearer", new Celebrity("Harry Shearer",
                "Harry Julius Shearer is an American actor, voice actor, comedian, writer, musician, radio host, director and producer. Born in Los Angeles, California, Shearer began his career as a child actor."));

        celebrities.put("Pamela Hayden", new Celebrity("Pamela Hayden",
                "Pamela Hayden is an American actress and voice actress. She is best known for providing various voices for the animated television show The Simpsons, most notably Milhouse Van Houten and Rod Flanders."));

        celebrities.put("Tress MacNeille", new Celebrity("Tress MacNeille",
                "Tress MacNeille is an American voice actress and former disc jockey. She is best known for providing various voices on the animated series The Simpsons, Futurama, Rugrats, All Grown Up!, Tiny Toon Adventures, Animaniacs and Disney's House of Mouse."));

        celebrities.put("Maggie Roswell", new Celebrity("Maggie Roswell",
                "Maggie Roswell is an American actress, voice actress, comedian and writer from Los Angeles, California. She is well known for her voice work on the animated television series The Simpsons, in which she has played recurring characters such as Maude Flanders, Helen Lovejoy, Miss Hoover, and Luann Van Houten, as well as several minor characters."));


        for(Celebrity celebrity : celebrities.values()) {
            entityManager.getTransaction().begin();
            entityManager.persist(celebrity);
            entityManager.getTransaction().commit();
        }
    }

    public static void createMovies(EntityManager entityManager, List<Show> shows, Map<String, Celebrity> celebrities) {

        Show godfather1 = new Show("The Godfather",
                "It is the first installment in The Godfather trilogy",
                "Movie");
        godfather1.setDirector(celebrities.get("Francis Ford Coppola"));
        godfather1.setActors(List.of(celebrities.get("Marlon Brando"), celebrities.get("Al Pacino"), celebrities.get("James Caan"), celebrities.get("Richard S. Castellano"), celebrities.get("Robert Duvall"), celebrities.get("Sterling Hayden"), celebrities.get("John Marley"), celebrities.get("Richard Conte"), celebrities.get("Diane Keaton")));
        godfather1.setImage("Shows/2024-05-21T13:37:03.364853Z-The_Godfather.jpg");
        shows.add(godfather1);

        Show godfather2 = new Show("The Godfather Part II",
                "It is the second installment in The Godfather trilogy",
                "Movie");
        godfather2.setDirector(celebrities.get("Francis Ford Coppola"));
        godfather2.setActors(List.of(celebrities.get("Al Pacino"), celebrities.get("Robert Duvall"), celebrities.get("Diane Keaton"), celebrities.get("Robert De Niro"), celebrities.get("John Cazale"), celebrities.get("Talia Shire"), celebrities.get("Lee Strasberg"), celebrities.get("Michael V. Gazzo")));
        godfather2.setImage("Shows/2024-05-21T13:39:15.382612Z-The_Godfather_II.jpg");
        shows.add(godfather2);

        Show godfather3 = new Show("The Godfather Part III",
                "It is the third installment in The Godfather trilogy",
                "Movie");
        godfather3.setDirector(celebrities.get("Francis Ford Coppola"));
        godfather3.setImage("Shows/2024-05-21T13:39:58.078726Z-The_Godfather_III.jpg");
        godfather3.setActors(List.of(celebrities.get("Al Pacino"), celebrities.get("Diane Keaton"), celebrities.get("Talia Shire"), celebrities.get("Andy Garcia"), celebrities.get("Eli Wallach"), celebrities.get("Joe Mantegna"), celebrities.get("George Hamilton"), celebrities.get("Bridget Fonda"), celebrities.get("Sofia Coppola")));
        shows.add(godfather3);

        Show titanic = new Show("Titanic",
                "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
                "Movie");
        titanic.setDirector(celebrities.get("James Cameron"));
        titanic.setActors(List.of(celebrities.get("Leonardo DiCaprio"), celebrities.get("Kate Winslet"), celebrities.get("Billy Zane"), celebrities.get("Kathy Bates"), celebrities.get("Frances Fisher"), celebrities.get("Bill Paxton"), celebrities.get("Bernard Hill"), celebrities.get("Jonathan Hyde"), celebrities.get("David Warner")));
        titanic.setImage("Shows/2024-05-21T13:40:35.461537Z-Titanic.jpeg");
        shows.add(titanic);

        for(Show show : shows) {
            entityManager.getTransaction().begin();
            entityManager.persist(show);
            entityManager.getTransaction().commit();
        }

    }

    public static void createTVShows(EntityManager entityManager, List<Show> shows, Map<String, Celebrity> celebrities) {

        Show breakingBad = new Show("Breaking Bad",
                "A high school chemistry teacher turned methamphetamine manufacturing drug dealer",
                "TVShow");
        breakingBad.setDirector(celebrities.get("Vince Gilligan"));
        breakingBad.setActors(List.of(celebrities.get("Bryan Cranston"), celebrities.get("Aaron Paul"), celebrities.get("Anna Gunn"), celebrities.get("Dean Norris"), celebrities.get("Betsy Brandt"), celebrities.get("RJ Mitte"), celebrities.get("Bob Odenkirk"), celebrities.get("Giancarlo Esposito"), celebrities.get("Jonathan Banks")));
        breakingBad.setImage("Shows/2024-05-21T13:50:28.651982Z-Breaking_Bad.jpg");
        for(int i = 1; i <= 5; i++) {
            Season season = new Season(i, breakingBad);
            breakingBad.addSeason(season);
        }
        shows.add(breakingBad);

        Show gameOfThrones = new Show("Game of Thrones",
                "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
                "TVShow");
        gameOfThrones.setDirector(celebrities.get("David Benioff"));
        gameOfThrones.setActors(List.of(celebrities.get("Emilia Clarke"), celebrities.get("Kit Harington"), celebrities.get("Sophie Turner"), celebrities.get("Maisie Williams"), celebrities.get("Lena Headey"), celebrities.get("Nikolaj Coster-Waldau"), celebrities.get("Peter Dinklage"), celebrities.get("Iain Glen"), celebrities.get("Alfie Allen")));
        gameOfThrones.setImage("Shows/2024-05-21T13:45:25.495022Z-Game_Of_Thrones.jpg");
        for(int i = 1; i <= 8; i++) {
            Season season = new Season(i, gameOfThrones);
            gameOfThrones.addSeason(season);
        }
        shows.add(gameOfThrones);

        Show theOffice = new Show("The Office",
                "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
                "TVShow");
        theOffice.setDirector(celebrities.get("Greg Daniels"));
        theOffice.setActors(List.of(celebrities.get("Steve Carell"), celebrities.get("Rainn Wilson"), celebrities.get("John Krasinski"), celebrities.get("Jenna Fischer"), celebrities.get("B.J. Novak"), celebrities.get("Mindy Kaling"), celebrities.get("Ellie Kemper"), celebrities.get("Ed Helms"), celebrities.get("Angela Kinsey")));
        theOffice.setImage("Shows/2024-05-21T13:46:30.883347Z-The_Office.webp");
        for(int i = 1; i <= 9; i++) {
            Season season = new Season(i, theOffice);
            theOffice.addSeason(season);
        }
        shows.add(theOffice);

        Show friends = new Show("Friends",
                "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
                "TVShow");
        friends.setDirector(celebrities.get("David Crane"));
        friends.setActors(List.of(celebrities.get("Jennifer Aniston"), celebrities.get("Courteney Cox"), celebrities.get("Lisa Kudrow"), celebrities.get("Matt LeBlanc"), celebrities.get("Matthew Perry"), celebrities.get("David Schwimmer"), celebrities.get("James Michael Tyler"), celebrities.get("Elliott Gould"), celebrities.get("Christina Pickles")));
        friends.setImage("Shows/2024-05-21T13:47:34.573012Z-Friends.jpg");
        for(int i = 1; i <= 10; i++) {
            Season season = new Season(i, friends);
            friends.addSeason(season);
        }
        shows.add(friends);

        Show simpsons = new Show("The Simpsons",
                "The satiric adventures of a working-class family in the misfit city of Springfield.",
                "TVShow");
        simpsons.setDirector(celebrities.get("James L. Brooks"));
        simpsons.setActors(List.of(celebrities.get("Dan Castellaneta"), celebrities.get("Julie Kavner"), celebrities.get("Nancy Cartwright"), celebrities.get("Yeardley Smith"), celebrities.get("Hank Azaria"), celebrities.get("Harry Shearer"), celebrities.get("Pamela Hayden"), celebrities.get("Tress MacNeille"), celebrities.get("Maggie Roswell")));
        simpsons.setImage("Shows/2024-05-21T13:48:22.632927Z-The_Simpsons.webp");
        for(int i = 1; i <= 32; i++) {
            Season season = new Season(i, simpsons);
            simpsons.addSeason(season);
        }
        shows.add(simpsons);

        for(Show show : shows) {
            entityManager.getTransaction().begin();
            entityManager.persist(show);
            entityManager.getTransaction().commit();
        }
    }

    public static void createReviews(EntityManager entityManager, List<Show> shows, List<User> users, List<Review> reviews) {
        //Create ficticious reviews
        for (Show show : shows) {
            reviews.add(new Review(users.get(0), show, "Great movie, I loved it!", 5));
            reviews.add(new Review(users.get(1), show, "I didn't like it, it was too long", 2));
            reviews.add(new Review(users.get(2), show, "I loved the acting, it was amazing", 4));
            reviews.add(new Review(users.get(3), show, "I didn't like the story, it was too violent", 1));
            reviews.add(new Review(users.get(4), show, "I loved the movie, it was a masterpiece", 5));
        }

        for(Review review : reviews) {
            entityManager.getTransaction().begin();
            entityManager.persist(review);
            entityManager.getTransaction().commit();
        }
    }

    public static void likeRandomReviews(EntityManager entityManager, List<Review> reviews, List<User> users) {
        for (int i = 0; i < 200; i++) {
            int randomReviewId = (int) (Math.random() * reviews.size());
            int randomUserID = (int) (Math.random() * users.size());

            Review review = reviews.get(randomReviewId);
            User user = users.get(randomUserID);

            review.likeReview(user);
            user.likeReview(review);

            entityManager.getTransaction().begin();
            entityManager.persist(user);
            entityManager.persist(review);
            entityManager.getTransaction().commit();
        }
    }
}