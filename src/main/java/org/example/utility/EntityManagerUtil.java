package org.example.utility;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class EntityManagerUtil {
    final static private ThreadLocal<EntityManager> emRef = new ThreadLocal<>();

    private static EntityManagerFactory emf;

    public static void setFactory(EntityManagerFactory emf) {
        EntityManagerUtil.emf = emf;
    }

    public static EntityManager currentEntityManager() {
        final EntityManager em = emRef.get();
        if (em == null) {
            emRef.set(emf.createEntityManager());
        }
        return emRef.get();
    }
}