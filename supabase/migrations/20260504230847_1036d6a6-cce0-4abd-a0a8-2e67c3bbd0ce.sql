UPDATE auth.users
SET encrypted_password = crypt('Alpha_987', gen_salt('bf', 10)),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'kinggeneva83@gmail.com';