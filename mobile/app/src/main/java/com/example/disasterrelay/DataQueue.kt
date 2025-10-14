package com.example.disasterrelay

import androidx.room.*

@Entity
data class RelayMessage(
    @PrimaryKey val messageId: String,
    val recipientHash: String,
    val payload: String,
    val timestamp: Long
)

@Dao
interface RelayDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(message: RelayMessage)

    @Query("SELECT * FROM RelayMessage")
    fun getAll(): List<RelayMessage>
}

@Database(entities = [RelayMessage::class], version = 1)
abstract class RelayDatabase : RoomDatabase() {
    abstract fun relayDao(): RelayDao
}
