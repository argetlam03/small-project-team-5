USE COP4331;
TRUNCATE TABLE Contacts;
TRUNCATE TABLE Users;

INSERT INTO Users (FirstName,LastName,Login,Password) VALUES
    ('Haley','Cohen', 'Haley12345', '12345!'),
    ('Lucas', 'Marris', 'lm', 'a')
    ;

INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES 
    ('SpongeBob SquarePants', '111-111-1111', 'spongebob@bikinibottom.com', 1),
    ('Patrick Star', '222-222-2222', 'patrick@bikinibottom.com', 1),
    ('Squidward Tentacles', '333-333-3333', 'squidward@bikinibottom.com', 1),
    ('Sandy Cheeks', '444-444-4444', 'sandy@bikinibottom.com', 1),
    ('Mr. Krabs', '555-555-5555', 'mrkrabs@krustykrab.com', 1),
    ('SpongeBob SquarePants', '111-111-1111', 'spongebob@bikinibottom.com', 2),
    ('Patrick Star', '222-222-2222', 'patrick@bikinibottom.com', 2),
    ('Squidward Tentacles', '333-333-3333', 'squidward@bikinibottom.com', 2),
    ('Sandy Cheeks', '444-444-4444', 'sandy@bikinibottom.com', 2),
    ('Mr. Krabs', '555-555-5555', 'mrkrabs@krustykrab.com', 2)
    ;